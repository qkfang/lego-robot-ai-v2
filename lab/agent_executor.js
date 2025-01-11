import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { createRetrieverTool } from "langchain/tools/retriever";
import dotenv from 'dotenv';

dotenv.config();
const AgentState = Annotation.Root({
  messages: ({
    reducer: (x, y) => x.concat(y),
  }),
});


import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const urls = [
    // "https://github.com/mcasalaina/QuestionnaireMultiagent/blob/master/MultiAgent.cs",
    // "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
    // "https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/",
];

const docs = await Promise.all(
    urls.map((url) => new CheerioWebBaseLoader(url).load()),
);
const docsList = docs.flat();

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
});
const docSplits = await textSplitter.splitDocuments(docsList);

// Add to vectorDB
const vectorStore = await MemoryVectorStore.fromDocuments(
    docSplits,
    new OpenAIEmbeddings(),
);

const retriever = vectorStore.asRetriever();



const tool = createRetrieverTool(
    retriever,
    {
        name: "retrieve_blog_posts",
        description:
            "Search and return information about Lilian Weng blog posts on LLM agents, prompt engineering, and adversarial attacks on LLMs.",
    },
);

const tools = [tool];

const toolNode = new ToolNode(tools);


import { ChatOpenAI } from "@langchain/openai";
import { END } from "@langchain/langgraph";

// Define the LLM to be used in the agent
const llm = new ChatOpenAI({
    model: "gpt-4o",
  temperature: 0,
}).bindTools(tools); // Ensure you bind the same tools passed to the ToolExecutor to the LLM, so these tools can be used in the agent

// Define logic that will be used to determine which conditional edge to go down
const shouldContinue = (data) => {
  const { messages } = data;
  const lastMsg = messages[messages.length - 1];
  // If the agent called a tool, we should continue. If not, we can end.
  if (!("tool_calls" in lastMsg) || !Array.isArray(lastMsg.tool_calls) || !lastMsg?.tool_calls?.length) {
    return END;
  }
  // By returning the name of the next node we want to go to
  // LangGraph will automatically route to that node
  return "executeTools";
};

const callModel = async (data) => {
  const { messages } = data;
  const result = await llm.invoke(messages, config);
  return {
    messages: [result],
  };
};


import { START, StateGraph } from "@langchain/langgraph";

// Define a new graph
const workflow = new StateGraph(AgentState)
  // Define the two nodes we will cycle between
  .addNode("callModel", callModel)
  .addNode("executeTools", toolNode)
  // Set the entrypoint as `callModel`
  // This means that this node is the first one called
  .addEdge(START, "callModel")
  // We now add a conditional edge
  .addConditionalEdges(
    // First, we define the start node. We use `callModel`.
    // This means these are the edges taken after the `agent` node is called.
    "callModel",
    // Next, we pass in the function that will determine which node is called next.
    shouldContinue,
  )
  // We now add a normal edge from `tools` to `agent`.
  // This means that after `tools` is called, `agent` node is called next.
  .addEdge("executeTools", "callModel");

const app = workflow.compile();


import { HumanMessage } from "@langchain/core/messages";

let finalResult = null;

const prettyLogOutput = (output) => {
  const keys = Object.keys(output);
  const firstItem = output[keys[0]];
  if ("messages" in firstItem) {
    console.log(`(node) ${keys[0]}:`, firstItem.messages[0]);
    console.log("----\n");
  }
}

const inputs = { messages: [new HumanMessage("Search the web for the weather in sf")] };
for await (const s of await app.stream(inputs)) {
  prettyLogOutput(s);
  if ("callModel" in s && s.callModel.messages?.length) {
    finalResult = s.callModel.messages[0];
  }
}

console.log("Final Result: ", finalResult.content)