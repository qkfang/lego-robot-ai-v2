import { StateGraph, START, END } from "@langchain/langgraph";


// State
const graphStateChannels = {
  name: {
    value: (prevName, newName) => newName,
    default: () => "Ada Lovelace",
  },
  isHuman: {
    value: (prevIsHuman, newIsHuman) =>
      newIsHuman ?? prevIsHuman ?? false,
  },
};

// A node that says hello
function sayHello(state) {
  console.log(`Hello ${state.name}!`); // Change the name

  const newName = "Bill Nye";

  console.log(`Changing the name to '${newName}'`);

  return {
    name: newName,
  };
}

// A node that says bye
function sayBye(state) {
  if (state.isHuman) {
    console.log(`Goodbye ${state.name}!`);
  } else {
    console.log(`Beep boop XC123-${state.name}!`);
  }
  return {};
}

//Initialise the LangGraph
const graphBuilder = new StateGraph({ channels: graphStateChannels }) // Add our nodes to the Graph
  .addNode("sayHello", sayHello)
  .addNode("sayBye", sayBye) // Add the edges between nodes
  .addEdge(START, "sayHello")
  .addEdge("sayHello", "sayBye")
  .addEdge("sayBye", END);

const result = await graphBuilder.compile().invoke({
  name: "Anchit",
  isHuman: true,
});