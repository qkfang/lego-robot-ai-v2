import os
import logging
import json
from logging import INFO
from typing import Any
from azure.cosmos import CosmosClient, PartitionKey
from azure.identity import DefaultAzureCredential
import azure.cosmos.exceptions as exceptions
from typing import List, Optional, Union, TYPE_CHECKING
from backend.rtmt import RTMiddleTier, Tool, ToolResult, ToolResultDirection

class CosmosDBStore:
    db_host: str
    db_name: str
    container_name: str
    cosmos_client: CosmosClient
    logging.basicConfig(level=logging.INFO)

    def load_from_file(self, file_path: str):
        with open(file_path, "r") as file:
            return json.load(file)

    def insert_teams(self, container_name: str, teams: List[any]):
        self.logger.info("Inserting teams into database")
        try:
            container = self.db.get_container_client(container_name)
            for team in teams:
                container.create_item( team )
        except exceptions.CosmosResourceExistsError as e:
            print("Item already exists.")
            logging.debug(e)
        except exceptions.CosmosHttpResponseError as e:
            print("Request to the Azure Cosmos database service failed.")
            logging.error(e)

    def create_container(self, container_name: str):
        self.logger.info("Creating container in database")
        templates_path = os.path.join(os.path.dirname(__file__), 'templates.json')
        templates = self.load_from_file(templates_path)
        try:
            container = self.db.get_container_client(container_name)
            self.db.create_container(id=container_name, partition_key=PartitionKey(path="/team"))
            print(f"Container created or returned: {container.id}")
            self.insert_teams(container_name, templates)
        except exceptions.CosmosResourceExistsError as e:
            print("Container already exists.")
            logging.debug(e)
            self.insert_teams(container_name, templates)
        except exceptions.CosmosHttpResponseError as e:
            print("Request to the Azure Cosmos database service failed.")
            logging.error(e)

    def __init__(self, db_host: str, db_name:str, container_name: str):
        self.logger = logging.getLogger("cosmosdb")
        self.logger.info("Initializing CosmosDBStore")
        self.db_host = db_host
        self.db_name = db_name
        self.container_name = container_name
        self.cosmos_client = CosmosClient(db_host, DefaultAzureCredential())
        self.db = self.cosmos_client.get_database_client(db_name)
        self.create_container(container_name)

    
    async def get_schema_from_database(self, team: str): 
        self.logger.info("Getting schema from database")
        try:
            container = self.db.get_container_client(self.container_name)
        
            query = "SELECT * FROM c WHERE c.team = @team"
            parameters = [{"name": "@team", "value": team}]
            response = container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True)
            
            fields = []

            for item in response:
                print(json.dumps(item, indent=True))
                fields.append(item)

            return fields
        except exceptions.CosmosHttpResponseError as e:
            print("Retrieval for schema failed")
            logging.error(e)


    async def get_report_fields(self, args: Any) -> ToolResult:
        team = args["team"].lower()
        fields = await self.get_schema_from_database(team)
        print(fields)
        return ToolResult(fields, ToolResultDirection.TO_SERVER)
            
    async def write_report(self, args: Any) -> ToolResult:
        report = {
            "player_name": args["player_name"],
            "player_note": args["player_note"],
            "game_score": args["game_score"],
            "game_date": args["game_date"]
        }
        # Return the result to the client
        return ToolResult(report, ToolResultDirection.TO_CLIENT)
