import { config } from 'dotenv';
import readline from 'readline/promises';
import { GoogleGenAI } from "@google/genai";
import { text } from 'stream/consumers';
import { type } from 'os';
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

const mcpClient = new Client({
    name: 'example-client',
    version: '1.0.0'
})

const chatHistory = [];
let tool = [];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


mcpClient.connect(new SSEClientTransport(new URL('http://localhost:9999/sse'))).then(async () => {
    console.log('Connected to Model Context Protocol server');
    tool = (await mcpClient.listTools()).tools.map(tool => {
        return {
            name: tool.name,
            description: tool.description,
            parameters: {
                type: tool.inputSchema.type,
                properties: tool.inputSchema.properties,
                required: tool.inputSchema.required
            }
        }
    });
    chatLoop();
})

async function chatLoop(toolCall) {

    if (toolCall) {
        console.log(`Tool Call: ${toolCall.name}`);

        chatHistory.push({
            role: 'model',
            parts: [{
                text: `Calling tool ${toolCall.name} `,
                type: 'text'
            }]
        });
        const toolresult = await mcpClient.callTool({
            name: toolCall.name,
            arguments: toolCall.args
        });

        chatHistory.push({
            role: 'user',
            parts: [{
                text: "tool Results: " + toolresult.content[0].text,
                type: 'text'
            }]
        });
        // console.log(toolresult);
    } else {
        const question = await rl.question('\nYou: ');
        chatHistory.push({
            role: 'user',
            parts: [{
                text: question,
                type: 'text'
            }]
        })
    }



    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: chatHistory,
        config: {
            tools: [
                {
                    functionDeclarations: tool
                }
            ]
        }
    })
    const functionCall = response.candidates[0].content.parts[0].functionCall;
    const responseText = response.candidates[0].content.parts[0].text;

    if (functionCall) {
        return chatLoop(functionCall);
    }


    chatHistory.push({
        role: 'model',
        parts: [{
            text: responseText,
            type: 'text'
        }]
    })

    console.log(`AI: ${responseText}`);
    chatLoop();
}

