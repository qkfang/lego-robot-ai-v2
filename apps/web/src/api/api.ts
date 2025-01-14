import { ChatAppResponse, ChatAppResponseOrError, ChatAppRequest, Config } from "./models";
import { BACKEND_URI } from "./BACKEND_URI";
import { OpenAIClient, OpenAIClientOptions, AzureKeyCredential, Completions} from '@azure/openai';

export async function chatApi(request: ChatAppRequest): Promise<Response> {
    const body = JSON.stringify(request);
    return await fetch(`${BACKEND_URI}/chat`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: body
    });
}


export async function imageApi(file: File): Promise<Response> {
    const formData = new FormData();
    formData.append("file", file);
    return await fetch(`${BACKEND_URI}/image`, {
        method: "POST",
        mode: "cors",
        body: formData,
    });
}

export async function visionApi(prompt: string[]): Promise<Completions> {
    const options = {
        api_version: "2024-08-01-preview"
      };

    const client = new OpenAIClient(
        `${BACKEND_URI}/vision`,
        new AzureKeyCredential("-"),
        options
      );
      // ?api-version=2023-12-01-preview
      const deploymentName = 'completions';
      const result = await client.getChatCompletions(deploymentName, prompt, {
        maxTokens: 200,
        temperature: 0.25
      });
      return result.choices[0].message.content;
}


export async function dalleApi(prompt: string): Promise<Completions> {
    const options = {
        api_version: "2023-12-01-preview"
      };
    const size = '1024x1024';
    const n = 1;
    const client = new OpenAIClient(
        `${BACKEND_URI}/dalle`,
        new AzureKeyCredential("-"),
        options
      );
      // ?api-version=2023-12-01-preview
      const deploymentName = 'dalle3';
      const result = await client.getImages(deploymentName, prompt, { n, size });
      console.log(result);
      return result.data[0].url;
}

export async function translateApi(text: string, from: string, to: string): Promise<Response> {
    const url = `${BACKEND_URI}/translate`;
    const body = 
    [{
        "text": `${text}`
    }];
    
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

export async function webchatApi(text: string): Promise<Response> {
    const newWebChat = {
        message: text
      };
      return await fetch(`${BACKEND_URI}/webchat`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWebChat)
      });
}

export function getCitationFilePath(citation: string): string {
    return `${BACKEND_URI}/content/${citation}`;
}
