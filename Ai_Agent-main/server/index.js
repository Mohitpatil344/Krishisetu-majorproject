// import express, { text } from "express";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { createPost, analyzeSentiment } from "./mcp.tools.js";
// import { z } from "zod";

// const server = new McpServer({
//   name: "backwards-compatible-server",
//   version: "1.0.0"
// });

// // ... set up server resources, tools, and prompts ...

// const app = express();
// app.use(express.json());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
  
//   next();
// });

// // Store transports for each session type
// const transports = {
//   sse: {},
//   streamableHttp: {}
// };

// server.tool(
//   "addTwoNumbers",
//   "Add two numbers", {
//   a: z.number(),
//   b: z.number()
// },
//   async (args) => {
//     const { a, b } = args;
//     return {
//       content: [
//         {
//           type: "text",
//           text: `The sum of ${a} and ${b} is ${a + b}.`
//         }
//       ]
//     }
//   }
// )

// server.tool(
//   "createPost",
//   "Create a post on X formerly known as Twitter", {
//     status: z.string()
//   },
//   async (args) => {
//     const { status } = args;
//     return await createPost(status);
//   }
// );

// server.tool(
//   "analyzeSentiment",
//   "Analyze the sentiment of a text", {
//     text: z.string()
//   },
//   async (args) => {
//     try {
//       return await analyzeSentiment(args.text);
//     } catch (error) {
//       console.error("Error analyzing sentiment:", error);
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Error analyzing sentiment: ${error.message}`
//           }
//         ]
//       };
//     }
//   }
// );

// // Modern Streamable HTTP endpoint
// app.all('/mcp', async (req, res) => {
//   // Handle Streamable HTTP transport for modern clients
//   // Implementation as shown in the "With Session Management" example
//   // ...
// });

// // Legacy SSE endpoint for older clients
// app.get('/sse', async (req, res) => {
//   // Define heartbeatInterval outside the try block so it's accessible in the catch block
//   let heartbeatInterval;
  
//   try {
//     console.log("SSE connection initiated");
    
//     // Set proper SSE headers
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
    
//     // IMPORTANT: Remove these two lines that were causing issues
//     // res.setHeader('X-Accel-Buffering', 'no'); 
//     // res.flushHeaders();
    
//     // Create transport FIRST before any writes to the response
//     const transport = new SSEServerTransport('/messages', res);
//     const sessionId = transport.sessionId;
//     transports.sse[sessionId] = transport;
    
//     console.log(`SSE transport created with sessionId: ${sessionId}`);
    
//     // Set up heartbeat AFTER transport is created
//     heartbeatInterval = setInterval(() => {
//       if (!res.finished) {
//         res.write(":heartbeat\n\n");
//       }
//     }, 30000);
    
//     // Handle disconnection
//     req.on("close", () => {
//       console.log(`SSE connection closed for sessionId: ${sessionId}`);
//       if (heartbeatInterval) {
//         clearInterval(heartbeatInterval);
//       }
//       delete transports.sse[sessionId];
//     });
    
//     // Connect to MCP server
//     await server.connect(transport);
//   } catch (error) {
//     console.error("Error in SSE endpoint:", error);
//     // Now heartbeatInterval is in scope
//     if (heartbeatInterval) {
//       clearInterval(heartbeatInterval);
//     }
//     // Only send error response if headers haven't been sent
//     if (!res.headersSent) {
//       res.status(500).send("Internal server error");
//     }
//   }
// });

// // Legacy message endpoint for older clients
// app.post('/messages', express.json(), async (req, res) => {
//   try {
//     const sessionId = req.query.sessionId;
//     console.log(`Received message for sessionId: ${sessionId}`, req.body);
    
//     if (!sessionId) {
//       return res.status(400).json({ error: 'Missing sessionId parameter' });
//     }
    
//     const transport = transports.sse[sessionId];
//     if (transport) {
//       await transport.handlePostMessage(req, res, req.body);
//     } else {
//       console.error(`No transport found for sessionId: ${sessionId}`);
//       res.status(400).json({ error: 'No transport found for sessionId', sessionId });
//     }
//   } catch (error) {
//     console.error('Error handling message:', error);
//     if (!res.headersSent) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// });

// app.listen(3000, () => console.log('MCP server listening on port 3000!'));


import express from "express";
import { z } from "zod";
import { 
  createPost, 
  createGitHubRepository,
  parseRepositoryPrompt,
  listGitHubRepositories,
  createFileInRepository,
  createMultipleFilesInRepository,
  parseFileCreationPrompt,
  generateProjectStructure,
  createThreadsPost,
  parseThreadsPrompt,
  getThreadsUserProfile,
  getThreadsUserPosts,
  createThreadsThread,
  validateThreadsConfiguration,
  createMultiPlatformPost,
  parseMultiPlatformPrompt,
  checkPlatformConfigurations
} from "./mcp.tools.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

process.on('uncaughtException', (error) => {
console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = new McpServer({
  name: "backwards-compatible-server",
  version: "1.0.0"
});
const PORT = process.env.PORT || 9999;
const KEEP_ALIVE_INTERVAL_MS = 25000;
const app = express()

const transports = {
  sse: {},
  streamableHttp: {}
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});


server.tool(
  "addTwoNumbers",
  "Add two numbers", {
  a: z.number(),
  b: z.number()
},
  async (args) => {
    const { a, b } = args;
    return {
      content: [
        {
          type: "text",
          text: `The sum of ${a} and ${b} is ${a + b}.`
        }
      ]
    }
  }
)

server.tool(
  "createPost",
  "Create a post on X formerly known as Twitter", {
    status: z.string(),
    imageData: z.string().optional().describe("Base64 image data (data:image/jpeg;base64,...) or image URL - will be uploaded to Cloudinary automatically")
  },
  async (args) => {
    const { status, imageData } = args;
    return await createPost(status, imageData);
  }
);

server.tool(
  "createGitHubRepo",
  "Create a new GitHub repository with specified configuration", {
    prompt: z.string().describe("Natural language description of the repository to create (e.g., 'Create a private Node.js project called my-app with MIT license')")
  },
  async (args) => {
    try {
      console.log('Parsing repository creation prompt...');
      const repoConfig = await parseRepositoryPrompt(args.prompt);
      
      console.log('Creating repository with config:', repoConfig);
      return await createGitHubRepository(
        repoConfig.name,
        repoConfig.description,
        repoConfig.isPrivate,
        repoConfig.hasReadme,
        repoConfig.gitignoreTemplate,
        repoConfig.license
      );
    } catch (error) {
      console.error("Error creating GitHub repository:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating GitHub repository: ${error.message}`
          }
        ]
      };
    }
  }
);


server.tool(
  "createGitHubRepoAdvanced",
  "Create a GitHub repository with explicit parameters", {
    name: z.string().describe("Repository name"),
    description: z.string().optional().describe("Repository description"),
    isPrivate: z.boolean().default(false).describe("Make repository private"),
    hasReadme: z.boolean().default(true).describe("Initialize with README"),
    gitignoreTemplate: z.string().optional().describe("Gitignore template (Node, Python, Java, etc.)"),
    license: z.string().optional().describe("License template (mit, apache-2.0, gpl-3.0, etc.)")
  },
  async (args) => {
    try {
      return await createGitHubRepository(
        args.name,
        args.description,
        args.isPrivate,
        args.hasReadme,
        args.gitignoreTemplate,
        args.license
      );
    } catch (error) {
      console.error("Error creating GitHub repository:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating GitHub repository: ${error.message}`
          }
        ]
      };
    }
  }
);


server.tool(
  "listGitHubRepos",
  "List your GitHub repositories", {
    limit: z.number().default(10).describe("Number of repositories to fetch (max 100)")
  },
  async (args) => {
    try {
      return await listGitHubRepositories(Math.min(args.limit, 100));
    } catch (error) {
      console.error("Error listing GitHub repositories:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error listing GitHub repositories: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createFileInGitHubRepo",
  "Create a file in a GitHub repository with specified content", {
    repoName: z.string().describe("Repository name"),
    filePath: z.string().describe("File path (e.g., 'src/index.js', 'README.md')"),
    content: z.string().describe("File content"),
    commitMessage: z.string().optional().describe("Commit message (optional)"),
    branch: z.string().default("main").describe("Branch name (default: main)")
  },
  async (args) => {
    try {
      return await createFileInRepository(
        args.repoName,
        args.filePath,
        args.content,
        args.commitMessage,
        args.branch
      );
    } catch (error) {
      console.error("Error creating file in GitHub repository:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating file: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createFilesInGitHubRepo",
  "Create files in a GitHub repository using natural language description", {
    prompt: z.string().describe("Natural language description of files to create (e.g., 'Create a README.md and package.json in my-project repo')")
  },
  async (args) => {
    try {
      console.log('Parsing file creation prompt...');
      const fileConfig = await parseFileCreationPrompt(args.prompt);
      
      console.log('Creating files with config:', fileConfig);
      
      if (fileConfig.files.length === 0) {
        return {
          content: [{
            type: "text",
            text: "No files to create were identified from your request. Please be more specific about which files you want to create."
          }]
        };
      }
      
      return await createMultipleFilesInRepository(
        fileConfig.repository,
        fileConfig.files,
        fileConfig.branch
      );
    } catch (error) {
      console.error("Error creating files in GitHub repository:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating files: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "generateProjectStructure",
  "Generate a complete project structure for common project types", {
    repoName: z.string().describe("Repository name"),
    projectType: z.enum(["node", "react", "python", "javascript", "nodejs"]).describe("Project type"),
    projectName: z.string().optional().describe("Project name (defaults to repo name)")
  },
  async (args) => {
    try {
      return await generateProjectStructure(
        args.repoName,
        args.projectType,
        args.projectName
      );
    } catch (error) {
      console.error("Error generating project structure:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error generating project structure: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createGitHubRepoWithFiles",
  "Create a GitHub repository and immediately add project files", {
    prompt: z.string().describe("Description of repository and files to create (e.g., 'Create a React project called my-app with basic components')")
  },
  async (args) => {
    try {
      console.log('Parsing repository and file creation prompt...');
      
      const repoConfig = await parseRepositoryPrompt(args.prompt);
      const repoResult = await createGitHubRepository(
        repoConfig.name,
        repoConfig.description,
        repoConfig.isPrivate,
        false, 
        repoConfig.gitignoreTemplate,
        repoConfig.license
      );
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      

      let projectType = 'basic';
      const prompt = args.prompt.toLowerCase();
      
      if (prompt.includes('react')) projectType = 'react';
      else if (prompt.includes('node') || prompt.includes('javascript')) projectType = 'node';
      else if (prompt.includes('python')) projectType = 'python';
      
      let structureResult = null;
      if (projectType !== 'basic') {
        structureResult = await generateProjectStructure(repoConfig.name, projectType);
      } else {

        const fileConfig = await parseFileCreationPrompt(args.prompt);
        if (fileConfig.files.length > 0) {
          structureResult = await createMultipleFilesInRepository(
            repoConfig.name,
            fileConfig.files
          );
        }
      }
      
      let combinedText = repoResult.content[0].text;
      
      if (structureResult) {
        combinedText += '\n\n' + structureResult.content[0].text;
      }
      
      return {
        content: [{
          type: "text",
          text: combinedText
        }]
      };
      
    } catch (error) {
      console.error("Error creating GitHub repository with files:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating repository with files: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createThreadsPost",
  "Create a post on Threads with text and optional media", {
    prompt: z.string().describe("Natural language description of the Threads post to create (e.g., 'Post about my new project #coding #threads')")
  },
  async (args) => {
    try {
      console.log('Parsing Threads post prompt...');
      const postConfig = await parseThreadsPrompt(args.prompt);
      
      console.log('Creating Threads post with config:', postConfig);
      return await createThreadsPost(
        postConfig.text,
        postConfig.mediaUrl,
        postConfig.replyToPostId
      );
    } catch (error) {
      console.error("Error creating Threads post:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating Threads post: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createThreadsPostAdvanced",
  "Create a Threads post with explicit parameters", {
    text: z.string().describe("Post text content (max 500 characters)"),
    mediaUrl: z.string().optional().describe("URL of media to include in the post"),
    replyToPostId: z.string().optional().describe("ID of post to reply to (for creating replies)")
  },
  async (args) => {
    try {
      return await createThreadsPost(
        args.text,
        args.mediaUrl,
        args.replyToPostId
      );
    } catch (error) {
      console.error("Error creating Threads post:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating Threads post: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createThreadsThread",
  "Create a thread (series of connected posts) on Threads", {
    posts: z.array(z.object({
      text: z.string().describe("Text content for this post"),
      mediaUrl: z.string().optional().describe("Optional media URL for this post")
    })).describe("Array of posts to create as a thread")
  },
  async (args) => {
    try {
      return await createThreadsThread(args.posts);
    } catch (error) {
      console.error("Error creating Threads thread:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating Threads thread: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "getThreadsProfile",
  "Get information about the connected Threads account",
  {},
  async (args) => {
    try {
      return await getThreadsUserProfile();
    } catch (error) {
      console.error("Error getting Threads profile:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error getting Threads profile: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "getThreadsPosts",
  "Get recent posts from the connected Threads account", {
    limit: z.number().default(10).describe("Number of posts to fetch (max 25)")
  },
  async (args) => {
    try {
      return await getThreadsUserPosts(Math.min(args.limit, 25));
    } catch (error) {
      console.error("Error getting Threads posts:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error getting Threads posts: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "validateThreadsConfig",
  "Validate Threads API configuration and permissions",
  {},
  async (args) => {
    try {
      return await validateThreadsConfiguration();
    } catch (error) {
      console.error("Error validating Threads configuration:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error validating Threads configuration: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createMultiPlatformPost",
  "Create a post across multiple social media platforms (Twitter/X and Threads)", {
    prompt: z.string().describe("Natural language description of the post to create (e.g., 'Post about my new project on Twitter and Threads #coding #socialmedia')")
  },
  async (args) => {
    try {
      console.log('Parsing multi-platform posting prompt...');
      const postConfig = await parseMultiPlatformPrompt(args.prompt);
      
      console.log('Creating multi-platform post with config:', postConfig);
      return await createMultiPlatformPost(
        postConfig.text,
        postConfig.platforms,
        postConfig.mediaUrl
      );
    } catch (error) {
      console.error("Error creating multi-platform post:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating multi-platform post: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "createMultiPlatformPostAdvanced",
  "Create a post across specific social media platforms with explicit parameters", {
    text: z.string().describe("Post text content"),
    platforms: z.array(z.enum(["twitter", "x", "threads", "instagram"])).default(["twitter", "threads"]).describe("Platforms to post to"),
    mediaUrl: z.string().optional().describe("URL of media to include in the post")
  },
  async (args) => {
    try {
      const normalizedPlatforms = args.platforms.map(p => 
        p.toLowerCase() === 'x' ? 'twitter' : p.toLowerCase()
      );
      
      return await createMultiPlatformPost(
        args.text,
        normalizedPlatforms,
        args.mediaUrl
      );
    } catch (error) {
      console.error("Error creating multi-platform post:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error creating multi-platform post: ${error.message}`
          }
        ]
      };
    }
  }
);

server.tool(
  "checkPlatformConfigs",
  "Check which social media platforms are properly configured",
  {},
  async (args) => {
    try {
      return await checkPlatformConfigurations();
    } catch (error) {
      console.error("Error checking platform configurations:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error checking platform configurations: ${error.message}`
          }
        ]
      };
    }
  }
);



const sseConnections = new Map();

app.get("/health", (req, res) => {
res.status(200).json({ status: 'healthy' });
});

app.get("/sse", async (req, res) => {
const transport = new SSEServerTransport('/messages', res)
const sessionId = transport.sessionId; // Get session ID from transport
transports[sessionId] = transport;

// Start keep-alive ping
const intervalId = setInterval(() => {
if (sseConnections.has(sessionId) && !res.writableEnded) {
res.write(': keepalive\n\n');
} else {
// Should not happen if close handler is working, but clear just in case
clearInterval(intervalId);
sseConnections.delete(sessionId);
}
}, KEEP_ALIVE_INTERVAL_MS);

// Store connection details
sseConnections.set(sessionId, { res, intervalId });
// console.log([SSE Connection] Client connected: ${sessionId}, starting keep-alive.);

res.on("close", () => {
// console.log([SSE Connection] Client disconnected: ${sessionId}, stopping keep-alive.);
// Clean up transport
delete transports[sessionId];
// Clean up keep-alive interval
const connection = sseConnections.get(sessionId);
if (connection) {
clearInterval(connection.intervalId);
sseConnections.delete(sessionId);
}
});

// Connect server to transport after setting up handlers
try {
await server.connect(transport)
} catch (error) {
// console.error([SSE Connection] Error connecting server to transport for ${sessionId}:, error);
// Ensure cleanup happens even if connect fails
clearInterval(intervalId);
sseConnections.delete(sessionId);
delete transports[sessionId];
if (!res.writableEnded) {
res.status(500).end('Failed to connect MCP server to transport');
}
}
});

app.post("/messages", async (req, res) => {
const sessionId = req.query.sessionId ;
const transport = transports[sessionId];
if (transport) {
console.log('Transport found:', transport.sessionId);
await transport.handlePostMessage(req, res);
} else {
res.status(400).send('No transport found for sessionId');
}
});

console.log(` Server is running on port ${PORT}`)
app.listen(PORT)


