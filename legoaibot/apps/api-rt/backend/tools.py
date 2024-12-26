import re
from typing import Any

from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential

from backend.rtmt import RTMiddleTier, Tool, ToolResult, ToolResultDirection

_get_fields_tool_schema = {
    "type": "function",
    "name": "get_fields",
    "description": "Search the report database for a set of questions that need to be answered by the user. The knowledge base is in English, translate to and from English if " + \
                   "needed. Results are returned in JSON format with a set of questions that need to be answered by the user.",
    "parameters": {
        "type": "object",
        "properties": {
            "team": {
                "type": "string",
                "description": "The name of the player."
            }
        },
        "required": ["team"],
        "additionalProperties": False
    }
}

async def _generate_game_tool(args: Any) -> ToolResult:
    report = {
        "game_score": args["game_score"],
        "game_date": args["game_date"]
    }
    # Return the result to the client
    return ToolResult(report, ToolResultDirection.TO_CLIENT)

# Define the schema for the 'generate_game' tool
_generate_game_tool_schema = {
    "type": "function",
    "name": "generate_game",
    "description": "Generates a JSON report of the player and game attributes derived from the conversation.",
    "parameters": {
        "type": "object",
        "properties": {
            "game_score": {
                "type": "string",
                "description": "Score of the game."
            },
            "game_date": {
                "type": "string",
                "description": "Date of the game."
            }
        },
        "required": [ "game_score", "game_date"],
        "additionalProperties": False
    }
}

async def _save_game_tool(args: Any) -> ToolResult:
    report = {
        "game_score": args["game_score"],
        "game_date": args["game_date"]
    }
    # Return the result to the client
    return ToolResult(report, ToolResultDirection.TO_CLIENT)

_save_game_tool_schema = {
    "type": "function",
    "name": "save_game",
    "description": "Save a JSON game record derived from the conversation.",
    "parameters": {
        "type": "object",
        "properties": {
            "game_score": {
                "type": "string",
                "description": "Score of the game."
            },
            "game_date": {
                "type": "string",
                "description": "Date of the game."
            }
        },
        "required": [ "game_score", "game_date"],
        "additionalProperties": False
    }
}
