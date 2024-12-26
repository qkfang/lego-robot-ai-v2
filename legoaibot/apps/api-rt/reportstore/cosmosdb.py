import os
import logging
import json
import random
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
    cosmos_client: CosmosClient
    logging.basicConfig(level=logging.INFO)

    def load_from_file(self, file_path: str):
        with open(file_path, "r") as file:
            return json.load(file)

    def insert_teams(self, teams: List[any]):
        self.logger.info("Inserting teams into database")
        try:
            container = self.db.get_container_client("fields")
            for team in teams:
                container.create_item( team )
        except exceptions.CosmosResourceExistsError as e:
            print("Item already exists.")
            logging.debug(e)
        except exceptions.CosmosHttpResponseError as e:
            print("Request to the Azure Cosmos database service failed 3.")
            logging.error(e)

    def create_container(self):
        
        templates_path = os.path.join(os.path.dirname(__file__), 'templates.json')
        templates = self.load_from_file(templates_path)
        try:
            container = self.db.get_container_client("fields")
            # self.db.create_container(id="fields", partition_key=PartitionKey(path="/team"))
            print(f"Container created or returned: {container.id}")
            self.insert_teams(templates)
        except exceptions.CosmosResourceExistsError as e:
            print("Container already exists.")
            logging.debug(e)
            self.insert_teams(templates)
        except exceptions.CosmosHttpResponseError as e:
            print("Request to the Azure Cosmos database service failed 1.")
            logging.error(e)

        try:
            container = self.db.get_container_client("games")
            self.db.create_container(id="games", partition_key=PartitionKey(path="/id"))
            print(f"Container created or returned: {container.id}")
        except exceptions.CosmosResourceExistsError as e:
            print("Container already exists.")
            logging.debug(e)
        except exceptions.CosmosHttpResponseError as e:
            print("Request to the Azure Cosmos database service failed 2.")
            logging.error(e)


    def __init__(self, db_host: str, db_key:str, db_name:str):
        self.logger = logging.getLogger("cosmosdb")
        self.db_host = db_host
        self.db_key = db_key
        self.db_name = db_name

        # self.cosmos_client = CosmosClient(db_host, DefaultAzureCredential())
        self.cosmos_client = CosmosClient(db_host, credential=db_key)
        self.db = self.cosmos_client.get_database_client(db_name)
        self.create_container()

    
    async def get_field(self, team: str): 
        self.logger.info("Getting schema from database")
        try:
            container = self.db.get_container_client("fields")
        
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


    async def get_fields(self, args: Any) -> ToolResult:
        team = args["team"].lower()
        fields = await self.get_field(team)
        print(fields)
        return ToolResult(fields, ToolResultDirection.TO_SERVER)
            
    async def generate_game(self, args: Any) -> ToolResult:
        game = {
            "game_score": args["game_score"],
            "game_date": args["game_date"]
        }
        # Return the result to the client
        return ToolResult(game, ToolResultDirection.TO_CLIENT)

    async def save_game(self, args: Any) -> ToolResult:
        game = {
            "id": str(random.randint(1, 100000)),
            "game_score": args["game_score"],
            "game_date": args["game_date"]
        }
        try:
            container = self.db.get_container_client("games")
            container.create_item(body=game)
            print("Game record saved successfully.")
        except exceptions.CosmosHttpResponseError as e:
            print(f"An error occurred: {e.message}")

        return ToolResult(game, ToolResultDirection.TO_CLIENT)
            