import logging
import os
from pathlib import Path
import time
import json
from aiohttp import web
from azure.core.credentials import AzureKeyCredential
from azure.identity import AzureDeveloperCliCredential, DefaultAzureCredential
from dotenv import load_dotenv

from backend.tools import _generate_game_tool_schema, _get_fields_tool_schema, _save_game_tool_schema
from backend.rtmt import RTMiddleTier, Tool

from acs.caller import OutboundCall
from reportstore.cosmosdb import CosmosDBStore
from aiohttp import web
import aiohttp_cors

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("voicerag")

async def create_app():
    if not os.environ.get("RUNNING_IN_PRODUCTION"):
        logger.info("Running in development mode, loading from .env file")
        load_dotenv()
    llm_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    llm_deployment = os.environ.get("AZURE_OPENAI_COMPLETION_DEPLOYMENT_NAME")
    llm_key = os.environ.get("AZURE_OPENAI_API_KEY")

    credential = None

    cosmos: CosmosDBStore = None
    caller: OutboundCall = None
    
    if not llm_key:
        if tenant_id := os.environ.get("AZURE_TENANT_ID"):
            logger.info(
                "Using AzureDeveloperCliCredential with tenant_id %s", tenant_id)
            credential = AzureDeveloperCliCredential(
                tenant_id=tenant_id, process_timeout=60)
        else:
            logger.info("Using DefaultAzureCredential")
            credential = DefaultAzureCredential()
    llm_credential = AzureKeyCredential(llm_key) if llm_key else credential

    if (os.environ.get("COSMOSDB_ACCOUNT_ENDPOINT") is not None and
            os.environ.get("COSMOSDB_DATABASE_NAME") is not None):
        
        cosmos = CosmosDBStore(
            os.environ.get("COSMOSDB_ACCOUNT_ENDPOINT"),
            os.environ.get("COSMOSDB_ACCOUNT_KEY"),
            os.environ.get("COSMOSDB_DATABASE_NAME"),
        )    

    app = web.Application()

    rtmt = RTMiddleTier(llm_endpoint, llm_deployment, llm_credential)

    # if (os.environ.get("ACS_CONNECTION_STRING") is not None and 
    #     os.environ.get("ACS_SOURCE_NUMBER") is not None):
        
    #     callback_path = os.environ.get("ACS_CALLBACK_PATH")

    #     if (os.environ.get("ACS_CALLBACK_PATH") is None):
    #         callback_path = os.environ.get("CONTAINER_APP_HOSTNAME")

    #     caller = OutboundCall(
    #         os.environ.get("ACS_CONNECTION_STRING"),
    #         os.environ.get("ACS_SOURCE_NUMBER"),
    #         callback_path
    #     )
    #     caller.attach_to_app(app, "/acs")

    rtmt.system_message = (
        "You are a helpful assistant that maintains a conversation with the user, while asking questions according to a specific set of fields.\n"
        "You MUST start the conversation by asking the user this questions: are you from team 1 or team 2 ?\n"
        "After that you should use the 'get_fields' tool to retrieve the required fields from the database for follow up questions\n"
        "The response from the 'get_fields' tool will give you a set of fields that you should fill by asking the user questions.\n"
        "After you have gone through all the questions in the schema, output a valid JSON file to the user by calling the 'generate_game' function,\n "
        "with the schema definition being various player and product attributes derived from the conversation.\n "
        "Finally ask user if to save the game score. If so, saving the score by calling the 'save_game' function."
        "You must engage the user in a conversation and ask the questions in the script. The user will provide the answers to the questions. Keep your question short."
    )
    rtmt.tools["get_fields"] = Tool(
        schema=_get_fields_tool_schema,
        target=lambda args: cosmos.get_fields(args),
    )
    rtmt.tools["generate_game"] = Tool(
        schema=_generate_game_tool_schema,
        target=lambda args: cosmos.generate_game(args),
    )
    rtmt.tools["save_game"] = Tool(
        schema=_save_game_tool_schema,
        target=lambda args: cosmos.save_game(args),
    )

    rtmt.attach_to_app(app, "/realtime")

    # Serve static files and index.html
    current_directory = Path(__file__).parent  # Points to 'app' directory
    static_directory = current_directory / 'static'

    # Ensure static directory exists
    if not static_directory.exists():
        raise FileNotFoundError("Static directory not found at expected path: {}".format(static_directory))

    # Serve index.html at root
    async def index(request):
        return web.FileResponse(static_directory / 'index.html')

    async def call(request):
        if (caller is not None):
            body = await request.json()
            print(body)
            target_number = body['target_number']
            return await caller.call(target_number)
        else:
            return web.Response(text="Outbound calling is not configured")

    async def acs_status(request):

        acs_status = {
            'status' : 'ACS is not configured',
            'outbound_calling_enabled': False,
            'inbound_calling_enabled': False
        }

        if (caller is not None):
            source_number = await caller._get_source_number()
            if (source_number != ''):
                acs_status['status'] = "ACS enabled with number " + source_number    
                acs_status['outbound_calling_enabled'] = True
                acs_status['inbound_calling_enabled'] = False
                acs_status['source_number'] = source_number        
        
        return web.json_response(acs_status)


    app.router.add_get('/', index)
    app.router.add_static('/static/', path=str(static_directory), name='static')
    app.router.add_post('/call', call)
    app.router.add_get('/status', acs_status)
    
    # Apply CORS to all routes
    
    # Configure CORS
    cors = aiohttp_cors.setup(app, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })

    for route in list(app.router.routes()):
        cors.add(route)


    return app

if __name__ == "__main__":
    host = os.environ.get("HOST", "localhost")
    port = int(os.environ.get("PORT", 8765))
    web.run_app(create_app(), host=host, port=port)