import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  SystemMessage,
  ToolMessage,
  AIMessage,
} from '@langchain/core/messages';
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LanggraphService {
  private model: ChatGoogleGenerativeAI;
  private tools: any[];
  private toolsByName: Record<string, any>;
  private llmWithTools: any;
 private readonly logger = new Logger(LanggraphService.name);
  constructor(private configService: ConfigService) {
    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: this.configService.get<any>('GOOGLE_API_KEY'),
    });

    const add = tool(
      async ({ a, b }: { a: number; b: number }) => {
        return `The result of ${a} + ${b} is ${a + b}`;
      },
      {
        name: 'add',
        description: 'Add two numbers',
        schema: z.object({ a: z.number(), b: z.number() }),
      },
    );

    const subtract = tool(
      async ({ a, b }: { a: number; b: number }) => {
        return `The result of ${a} - ${b} is ${a - b}`;
      },
      {
        name: 'subtract',
        description: 'Subtract two numbers',
        schema: z.object({ a: z.number(), b: z.number() }),
      },
    );

    this.tools = [add, subtract];
    this.toolsByName = Object.fromEntries(this.tools.map((t) => [t.name, t]));
    this.llmWithTools = this.model.bindTools(this.tools);
  }

  async explainStep(state: typeof MessagesAnnotation.State) {
    const result = await this.llmWithTools.invoke([
      new SystemMessage("You're a helpful assistant. Explain your plan."),
      ...state.messages,
    ]);
    return { messages: [result] };
  }

  shouldWaitForUser(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages.at(-1);
    return lastMessage instanceof AIMessage &&
      lastMessage.tool_calls?.length
      ? 'waitForUser'
      : '__end__';
  }

  async toolNode(state: typeof MessagesAnnotation.State) {
    const aiMsg = state.messages.at(-3);
    const results: ToolMessage[] = [];

    if (aiMsg instanceof AIMessage && aiMsg.tool_calls?.length) {
      for (const toolCall of aiMsg.tool_calls) {
        const tool = this.toolsByName[toolCall.name];
        const output = await tool.invoke(toolCall.args);
        results.push(
          new ToolMessage({
            content: output,
            tool_call_id: String(toolCall.id),
          }),
        );
      }
    }

    return { messages: results };
  }

  shouldExecuteTool(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages.at(-1);
    const userInput =
      typeof lastMessage?.content === 'string'
        ? lastMessage.content.toLowerCase()
        : '';
    return userInput.includes('yes') || userInput.includes('go ahead')
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

  async runGraphAgent(prompt: string, userConfirm?: string) {
    const agent = await this.buildAgent();
    const inputMessages = [{ role: 'user', content: prompt }];
    if (userConfirm)
      inputMessages.push({ role: 'user', content: userConfirm });

    const result = await agent.invoke({ messages: inputMessages });
    this.logger.log("result", result)
    return result.messages.map((msg) => msg.content).join('\n');
  }
}
