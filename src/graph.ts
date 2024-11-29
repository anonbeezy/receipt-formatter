import { Runnable, RunnableConfig } from '@langchain/core/runnables'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { HumanMessage } from '@langchain/core/messages'

import { llmChain } from './chatgpt'
import { AgentState } from './state'
import { START, StateGraph } from '@langchain/langgraph'
import { createSupervisorChain } from './supervisor'

// Helper function to run a node for a given agent
async function runAgentNode(props: {
  state: typeof AgentState.State
  agent: Runnable
  name: string
  config?: RunnableConfig
}) {
  const { state, agent, name, config } = props
  let result = await agent.invoke(state, config)
  // We convert the agent output into a format that is suitable
  // to append to the global state
  if (!result?.tool_calls || result.tool_calls.length === 0) {
    // If the agent is NOT calling a tool, we want it to
    // look like a human message.
    result = new HumanMessage({ ...result, name: name })
  }
  return {
    messages: [result],
    // Since we have a strict workflow, we can
    // track the sender so we know who to pass to next.
    sender: name,
  }
}

export const receiptFormatterAgent = llmChain
export const receiptFormatterNode = async (
  state: typeof AgentState.State,
  config?: RunnableConfig
) => {
  return runAgentNode({
    state,
    agent: receiptFormatterAgent,
    name: 'ReceiptFormatter',
    config,
  })
}

export const createGraph = async (supervisorChain, receiptFormatterNode) => {
  const workflow = new StateGraph(AgentState)
    .addNode('receiptFormatter', receiptFormatterNode)
    .addNode('supervisor', supervisorChain)

  workflow.addEdge('receiptFormatter', 'supervisor')

  workflow.addConditionalEdges(
    'supervisor',
    (x: typeof AgentState.State) => x.next
  )

  workflow.addEdge(START, 'supervisor')

  return workflow.compile()
}
