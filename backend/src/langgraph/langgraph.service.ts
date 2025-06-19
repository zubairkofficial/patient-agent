// langgraph.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  SystemMessage,
  ToolMessage,
  AIMessage,
  HumanMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LanggraphService {
  private model: ChatGoogleGenerativeAI;
  private tools: any[] = [];
  private toolsByName: Record<string, any> = {};
  private llmWithTools: any;
  private readonly logger = new Logger(LanggraphService.name);

  constructor(private configService: ConfigService) {
    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: this.configService.get<string>('GOOGLE_API_KEY'),
    });

    const add = tool(
      async ({ a, b }: { a: number; b: number }) =>
        `The result of ${a} + ${b} is ${a + b}`,
      {
        name: 'add',
        description: 'Add two numbers',
        schema: z.object({ a: z.number(), b: z.number() }),
      }
    );

    const subtract = tool(
      async ({ a, b }: { a: number; b: number }) =>
        `The result of ${a} - ${b} is ${a - b}`,
      {
        name: 'subtract',
        description: 'Subtract two numbers',
        schema: z.object({ a: z.number(), b: z.number() }),
      }
    );

    this.tools = [add, subtract];
    this.toolsByName = Object.fromEntries(this.tools.map((t) => [t.name, t]));
    this.llmWithTools = this.model.bindTools(this.tools);
  }

  async toolNode(state: (typeof MessagesAnnotation)['State']) {
    const aiMsg = state.messages.find(
      (msg) => msg instanceof AIMessage && msg.tool_calls?.length
    ) as AIMessage;

    const results: ToolMessage[] = [];

    if (aiMsg?.tool_calls?.length) {
      for (const call of aiMsg.tool_calls) {
        const tool = this.toolsByName[call.name];
        const output = await tool.invoke(call.args);
        results.push(
          new ToolMessage({
            content: output,
            tool_call_id: String(call.id),
          })
        );
      }
    }

    return { messages: results };
  }

  shouldExecuteTool(state: (typeof MessagesAnnotation)['State']) {
    const last = state.messages.at(-1);
    const content =
      typeof last?.content === 'string' ? last.content.toLowerCase() : '';
    return content.includes('yes') || content.includes('go ahead')
      ? 'toolCall'
      : '__end__';
  }

  async buildAgent() {
    return new StateGraph(MessagesAnnotation)
      .addNode('toolCall', this.toolNode.bind(this))
      .addEdge('__start__', 'toolCall')
      .addConditionalEdges('toolCall', this.shouldExecuteTool.bind(this), {
        toolCall: 'toolCall',
        __end__: '__end__',
      })
      .compile();
  }

  async runGraphAgent(prompt: string, confirm?: string) {
    const messages: BaseMessage[] = [new HumanMessage(prompt)];

    // ✅ Step 1: Ask LLM (and let it decide tool calls)
    const aiResponse = await this.llmWithTools.invoke(messages);
    messages.push(aiResponse);

    if (confirm) {
      messages.push(new HumanMessage(confirm));
    }

    // ✅ Step 2: Pass to LangGraph agent for tool call decision
    const agent = await this.buildAgent();
    const result = await agent.invoke({ messages });

    this.logger.log('Agent result', JSON.stringify(result, null, 2));

    return result.messages.map((m) => m.content).join('\n');
  }
}
