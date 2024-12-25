import re
from typing import Any

from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential

from backend.rtmt import RTMiddleTier, Tool, ToolResult, ToolResultDirection

_get_report_fields_tool_schema = {
    "type": "function",
    "name": "get_report_fields",
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

async def _generate_report_tool(args: Any) -> ToolResult:
    report = {
        "player_name": args["player_name"],
        "player_note": args["player_note"],
        "game_score": args["game_score"],
        "game_date": args["game_date"]
    }
    # Return the result to the client
    return ToolResult(report, ToolResultDirection.TO_CLIENT)

# Define the schema for the 'generate_report' tool
_generate_report_tool_schema = {
    "type": "function",
    "name": "generate_report",
    "description": "Generates a JSON report of the player and game attributes derived from the conversation.",
    "parameters": {
        "type": "object",
        "properties": {
            "player_name": {
                "type": "string",
                "description": "The name of the player."
            },
            "player_note": {
                "type": "string",
                "description": "Note from the player about the game."
            },
            "game_score": {
                "type": "string",
                "description": "Score of the game."
            },
            "game_date": {
                "type": "string",
                "description": "Date of the game."
            }
        },
        "required": ["player_name", "player_note", "game_score", "game_date"],
        "additionalProperties": False
    }
}
