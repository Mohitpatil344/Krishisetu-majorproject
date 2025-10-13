import { config } from 'dotenv';
import { Octokit } from "octokit";
import * as fs from 'fs/promises';
import { GoogleGenAI } from "@google/genai";
import * as path from 'path';

config();

const DB_FILE = path.join(process.cwd(), 'db.json');

const initializeDb = async () => {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({
            reminders: [],
            tasks: [],
            analytics: { queries: [] },
            savedSearches: []
        }));
    }
};

const readDb = async () => {
    await initializeDb();
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
};

const writeDb = async (data) => {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
};

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY}) : null;

const octokit = process.env.GITHUB_TOKEN ? new Octokit({
    auth: process.env.GITHUB_TOKEN,
}) : null;


export async function createGitHubRepository(repoName, description, isPrivate = false, hasReadme = true, gitignoreTemplate = null, license = null) {
  console.log(`Creating GitHub repository: ${repoName}`);
  
  try {
    if (!octokit || !process.env.GITHUB_TOKEN) {
      throw new Error('GitHub API not configured. Please set GITHUB_TOKEN environment variable.');
    }

    if (!repoName || typeof repoName !== 'string') {
      throw new Error('Repository name is required and must be a string.');
    }

    const cleanRepoName = repoName
      .toLowerCase()
      .replace(/[^a-z0-9\-_.]/g, '-')
      .replace(/^[-_.]+|[-_.]+$/g, '')
      .substring(0, 100);

    if (!cleanRepoName) {
      throw new Error('Repository name contains only invalid characters.');
    }

    try {
      await octokit.rest.repos.get({
        owner: process.env.GITHUB_USERNAME,
        repo: cleanRepoName,
      });
      
      throw new Error(`Repository '${cleanRepoName}' already exists.`);
    } catch (error) {
      if (error.status !== 404) {
        throw error; 
      }

    }

    const repoConfig = {
      name: cleanRepoName,
      description: description || `Repository created via AI Agent`,
      private: Boolean(isPrivate),
      has_issues: true,
      has_projects: true,
      has_wiki: true,
      auto_init: Boolean(hasReadme),
    };

    if (gitignoreTemplate) {
      repoConfig.gitignore_template = gitignoreTemplate;
    }

    if (license) {
      repoConfig.license_template = license;
    }

    console.log('Creating repository with config:', repoConfig);

    const response = await octokit.rest.repos.createForAuthenticatedUser(repoConfig);

    const db = await readDb();
    db.analytics.queries.push({
      type: 'github_repo_creation',
      repo_name: cleanRepoName,
      is_private: isPrivate,
      timestamp: new Date().toISOString()
    });
    await writeDb(db);

    const repoData = response.data;

    return {
      content: [{
        text: `✅ Successfully created GitHub repository!\n\n` +
              `📁 Repository Details:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `• Name: ${repoData.name}\n` +
              `• Description: ${repoData.description}\n` +
              `• URL: ${repoData.html_url}\n` +
              `• Clone URL: ${repoData.clone_url}\n` +
              `• SSH URL: ${repoData.ssh_url}\n` +
              `• Visibility: ${repoData.private ? 'Private' : 'Public'}\n` +
              `• Default Branch: ${repoData.default_branch}\n` +
              `• Created: ${new Date(repoData.created_at).toLocaleString()}\n\n` +
              `🚀 Next Steps:\n` +
              `1. Clone: git clone ${repoData.clone_url}\n` +
              `2. Navigate: cd ${repoData.name}\n` +
              `3. Start coding!\n\n` +
              `⏰ Created at: ${new Date().toLocaleString()}`,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('GitHub Repository Creation Error:', error);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error.status === 401) {
      errorMessage = 'GitHub authentication failed. Please check your GITHUB_TOKEN.';
    } else if (error.status === 403) {
      errorMessage = 'Permission denied. Check if your GitHub token has repo creation permissions.';
    } else if (error.status === 422) {
      errorMessage = 'Repository validation failed. The name might be invalid or already taken.';
    } else if (error.message?.includes('already exists')) {
      errorMessage = error.message;
    } else {
      errorMessage = error.message || 'Failed to create repository';
    }
    
    return {
      content: [{
        text: `❌ Error creating GitHub repository: ${errorMessage}\n\n` +
              `Please check your GitHub configuration and try again.`,
        type: 'text'
      }]
    };
  }
}

export async function parseRepositoryPrompt(prompt) {
  console.log(`Parsing repository creation prompt: "${prompt}"`);
  
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return parseRepositoryPromptFallback(prompt);
    }

    const parsePrompt = `Parse the following user request for creating a GitHub repository and extract the following information in JSON format:

{
  "name": "repository-name",
  "description": "repository description",
  "isPrivate": false,
  "hasReadme": true,
  "gitignoreTemplate": "Node" (optional: Node, Python, Java, etc.),
  "license": "mit" (optional: mit, apache-2.0, gpl-3.0, etc.)
}

Rules:
1. Repository name should be lowercase, use hyphens for spaces, and be GitHub-compatible
2. If privacy is not specified, default to false (public)
3. If README is not mentioned, default to true
4. Extract gitignore template from programming language mentions
5. Extract license from any license mentions
6. Make the description clear and professional

User request: "${prompt}"

Return only the JSON object, no additional text.`;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        role: 'user',
        parts: [{
          text: parsePrompt,
          type: 'text'
        }]
      }],
    });

    const response = result.candidates[0].content.parts[0].text;
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    
    try {
      const parsedData = JSON.parse(cleanedResponse);
      
      return {
        name: parsedData.name || 'new-repository',
        description: parsedData.description || 'Repository created via AI Agent',
        isPrivate: Boolean(parsedData.isPrivate),
        hasReadme: parsedData.hasReadme !== false,
        gitignoreTemplate: parsedData.gitignoreTemplate || null,
        license: parsedData.license || null
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return parseRepositoryPromptFallback(prompt);
    }

  } catch (error) {
    console.error('Error parsing repository prompt with Gemini:', error);
    return parseRepositoryPromptFallback(prompt);
  }
}

function parseRepositoryPromptFallback(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  let name = 'new-repository';
  const nameMatch = prompt.match(/"([^"]+)"|'([^']+)'|(?:called|named)\s+([a-zA-Z0-9\-_]+)/i);
  if (nameMatch) {
    name = (nameMatch[1] || nameMatch[2] || nameMatch[3]).toLowerCase().replace(/[^a-z0-9\-_]/g, '-');
  }

  const isPrivate = lowerPrompt.includes('private') && !lowerPrompt.includes('public');

  const hasReadme = !lowerPrompt.includes('no readme') && !lowerPrompt.includes('without readme');


  let gitignoreTemplate = null;
  if (lowerPrompt.includes('node') || lowerPrompt.includes('javascript') || lowerPrompt.includes('npm')) {
    gitignoreTemplate = 'Node';
  } else if (lowerPrompt.includes('python') || lowerPrompt.includes('django') || lowerPrompt.includes('flask')) {
    gitignoreTemplate = 'Python';
  } else if (lowerPrompt.includes('java') || lowerPrompt.includes('spring')) {
    gitignoreTemplate = 'Java';
  } else if (lowerPrompt.includes('react') || lowerPrompt.includes('vue') || lowerPrompt.includes('angular')) {
    gitignoreTemplate = 'Node';
  }

  let license = null;
  if (lowerPrompt.includes('mit license') || lowerPrompt.includes('mit')) {
    license = 'mit';
  } else if (lowerPrompt.includes('apache')) {
    license = 'apache-2.0';
  } else if (lowerPrompt.includes('gpl')) {
    license = 'gpl-3.0';
  }

  return {
    name,
    description: `Repository created via AI Agent`,
    isPrivate,
    hasReadme,
    gitignoreTemplate,
    license
  };
}

export async function listGitHubRepositories(limit = 10) {
  console.log('Fetching GitHub repositories...');
  
  try {
    if (!octokit || !process.env.GITHUB_TOKEN) {
      throw new Error('GitHub API not configured. Please set GITHUB_TOKEN environment variable.');
    }

    const response = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: limit,
      sort: 'updated',
      direction: 'desc'
    });

    const repos = response.data;

    if (repos.length === 0) {
      return {
        content: [{
          text: `📁 No repositories found in your GitHub account.`,
          type: 'text'
        }]
      };
    }

    let repoList = `📁 Your GitHub Repositories (${repos.length} most recent):\n` +
                   `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    repos.forEach((repo, index) => {
      repoList += `${index + 1}. **${repo.name}**\n` +
                  `   ${repo.description || 'No description'}\n` +
                  `   🔗 ${repo.html_url}\n` +
                  `   ${repo.private ? '🔒 Private' : '🌐 Public'} • ⭐ ${repo.stargazers_count} stars • 🍴 ${repo.forks_count} forks\n` +
                  `   📅 Updated: ${new Date(repo.updated_at).toLocaleDateString()}\n\n`;
    });

    return {
      content: [{
        text: repoList,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return {
      content: [{
        text: `❌ Error fetching repositories: ${error.message}`,
        type: 'text'
      }]
    };
  }
}

export async function createFileInRepository(repoName, filePath, content, commitMessage = null, branch = 'main') {
  console.log(`Creating file ${filePath} in repository: ${repoName}`);
  
  try {
    if (!octokit || !process.env.GITHUB_TOKEN) {
      throw new Error('GitHub API not configured. Please set GITHUB_TOKEN environment variable.');
    }

    if (!repoName || !filePath || content === undefined) {
      throw new Error('Repository name, file path, and content are required.');
    }

    const owner = process.env.GITHUB_USERNAME;
    
    try {
      await octokit.rest.repos.get({
        owner,
        repo: repoName,
      });
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Repository '${repoName}' not found. Please create it first.`);
      }
      throw error;
    }

    let existingFile = null;
    try {
      const response = await octokit.rest.repos.getContent({
        owner,
        repo: repoName,
        path: filePath,
        ref: branch
      });
      existingFile = response.data;
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }

    }

    const encodedContent = Buffer.from(content, 'utf8').toString('base64');
    
    const finalCommitMessage = commitMessage || 
      (existingFile ? `Update ${filePath}` : `Add ${filePath}`);

    const fileData = {
      owner,
      repo: repoName,
      path: filePath,
      message: finalCommitMessage,
      content: encodedContent,
      branch
    };

    if (existingFile) {
      fileData.sha = existingFile.sha;
    }

    const response = await octokit.rest.repos.createOrUpdateFileContents(fileData);

    const db = await readDb();
    db.analytics.queries.push({
      type: 'github_file_creation',
      repo_name: repoName,
      file_path: filePath,
      action: existingFile ? 'update' : 'create',
      timestamp: new Date().toISOString()
    });
    await writeDb(db);

    const fileInfo = response.data;
    const fileUrl = `https://github.com/${owner}/${repoName}/blob/${branch}/${filePath}`;

    return {
      content: [{
        text: `✅ Successfully ${existingFile ? 'updated' : 'created'} file in GitHub repository!\n\n` +
              `📄 File Details:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `• Repository: ${repoName}\n` +
              `• File Path: ${filePath}\n` +
              `• Branch: ${branch}\n` +
              `• Action: ${existingFile ? 'Updated' : 'Created'}\n` +
              `• Commit: ${finalCommitMessage}\n` +
              `• File URL: ${fileUrl}\n` +
              `• Commit URL: ${fileInfo.commit.html_url}\n` +
              `• Size: ${Buffer.from(content, 'utf8').length} bytes\n\n` +
              `🚀 File successfully ${existingFile ? 'updated' : 'added'} to repository!\n\n` +
              `⏰ ${existingFile ? 'Updated' : 'Created'} at: ${new Date().toLocaleString()}`,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('GitHub File Creation Error:', error);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error.status === 401) {
      errorMessage = 'GitHub authentication failed. Please check your GITHUB_TOKEN.';
    } else if (error.status === 403) {
      errorMessage = 'Permission denied. Check if your GitHub token has repo write permissions.';
    } else if (error.status === 404) {
      errorMessage = error.message || 'Repository or branch not found.';
    } else if (error.status === 422) {
      errorMessage = 'Invalid file path or content. Please check the file path format.';
    } else {
      errorMessage = error.message || 'Failed to create file';
    }
    
    return {
      content: [{
        text: `❌ Error creating file in GitHub repository: ${errorMessage}\n\n` +
              `Please check your GitHub configuration and try again.`,
        type: 'text'
      }]
    };
  }
}

export async function createMultipleFilesInRepository(repoName, files, branch = 'main') {
  console.log(`Creating ${files.length} files in repository: ${repoName}`);
  
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('Files array is required and must not be empty.');
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const result = await createFileInRepository(
          repoName,
          file.path,
          file.content,
          file.commitMessage,
          branch
        );
        results.push({ success: true, file: file.path, result });
        successCount++;
      } catch (error) {
        results.push({ success: false, file: file.path, error: error.message });
        errorCount++;
      }
    }

    let summary = `📁 Bulk File Creation Results:\n` +
                  `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                  `• Repository: ${repoName}\n` +
                  `• Total Files: ${files.length}\n` +
                  `• Successful: ${successCount}\n` +
                  `• Failed: ${errorCount}\n\n`;

    results.forEach((result, index) => {
      if (result.success) {
        summary += `✅ ${index + 1}. ${result.file} - Created successfully\n`;
      } else {
        summary += `❌ ${index + 1}. ${result.file} - Error: ${result.error}\n`;
      }
    });

    summary += `\n⏰ Completed at: ${new Date().toLocaleString()}`;

    return {
      content: [{
        text: summary,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('Bulk File Creation Error:', error);
    return {
      content: [{
        text: `❌ Error in bulk file creation: ${error.message}`,
        type: 'text'
      }]
    };
  }
}

export async function parseFileCreationPrompt(prompt) {
  console.log(`Parsing file creation prompt: "${prompt}"`);
  
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return parseFileCreationPromptFallback(prompt);
    }

    const parsePrompt = `Parse the following user request for creating files in a GitHub repository and extract the information in JSON format:

{
  "repository": "repo-name",
  "files": [
    {
      "path": "file/path/name.ext",
      "content": "file content here",
      "commitMessage": "optional commit message"
    }
  ],
  "branch": "main"
}

Rules:
1. Extract repository name from the prompt
2. Identify all files to be created with their paths and content
3. Generate appropriate file content based on the description
4. Use standard file structures for common file types
5. Default branch is 'main' unless specified
6. Generate meaningful commit messages if not provided

User request: "${prompt}"

Return only the JSON object, no additional text.`;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        role: 'user',
        parts: [{
          text: parsePrompt,
          type: 'text'
        }]
      }],
    });

    const response = result.candidates[0].content.parts[0].text;
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    
    try {
      const parsedData = JSON.parse(cleanedResponse);
      
      return {
        repository: parsedData.repository || 'unknown-repo',
        files: parsedData.files || [],
        branch: parsedData.branch || 'main'
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return parseFileCreationPromptFallback(prompt);
    }

  } catch (error) {
    console.error('Error parsing file creation prompt with Gemini:', error);
    return parseFileCreationPromptFallback(prompt);
  }
}

function parseFileCreationPromptFallback(prompt) {
  const files = [];
  
  if (prompt.toLowerCase().includes('readme')) {
    files.push({
      path: 'README.md',
      content: `# Project Title\n\nDescription of the project.\n\n## Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\nHow to use this project.\n`,
      commitMessage: 'Add README.md'
    });
  }
  
  if (prompt.toLowerCase().includes('package.json') || prompt.toLowerCase().includes('node')) {
    files.push({
      path: 'package.json',
      content: `{\n  "name": "project-name",\n  "version": "1.0.0",\n  "description": "",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js",\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "keywords": [],\n  "author": "",\n  "license": "ISC"\n}`,
      commitMessage: 'Add package.json'
    });
  }

  if (prompt.toLowerCase().includes('gitignore')) {
    files.push({
      path: '.gitignore',
      content: `node_modules/\n.env\n.DS_Store\n*.log\ndist/\nbuild/\n.nyc_output/\ncoverage/`,
      commitMessage: 'Add .gitignore'
    });
  }

  const repoMatch = prompt.match(/(?:in|to|repository)\s+["']?([a-zA-Z0-9\-_]+)["']?/i);
  const repository = repoMatch ? repoMatch[1] : 'unknown-repo';

  return {
    repository,
    files,
    branch: 'main'
  };
}

export async function generateProjectStructure(repoName, projectType, projectName = null) {
  console.log(`Generating ${projectType} project structure for: ${repoName}`);
  
  try {
    const files = [];
    const name = projectName || repoName;

    switch (projectType.toLowerCase()) {
      case 'node':
      case 'nodejs':
      case 'javascript':
        files.push(
          {
            path: 'package.json',
            content: `{\n  "name": "${name}",\n  "version": "1.0.0",\n  "description": "A Node.js project",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js",\n    "dev": "nodemon index.js",\n    "test": "jest"\n  },\n  "keywords": [],\n  "author": "",\n  "license": "ISC",\n  "dependencies": {},\n  "devDependencies": {\n    "nodemon": "^3.0.0",\n    "jest": "^29.0.0"\n  }\n}`,
            commitMessage: 'Add package.json'
          },
          {
            path: 'index.js',
            content: `console.log('Hello, World!');\n\n// Your code here\n`,
            commitMessage: 'Add main entry point'
          },
          {
            path: '.gitignore',
            content: `node_modules/\n.env\n.DS_Store\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\ndist/\nbuild/\n.nyc_output/\ncoverage/`,
            commitMessage: 'Add .gitignore'
          }
        );
        break;

      case 'react':
        files.push(
          {
            path: 'package.json',
            content: `{\n  "name": "${name}",\n  "version": "1.0.0",\n  "description": "A React application",\n  "main": "index.js",\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-scripts": "5.0.1"\n  },\n  "browserslist": {\n    "production": [">0.2%", "not dead", "not op_mini all"],\n    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]\n  }\n}`,
            commitMessage: 'Add package.json'
          },
          {
            path: 'public/index.html',
            content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${name}</title>\n</head>\n<body>\n    <div id="root"></div>\n</body>\n</html>`,
            commitMessage: 'Add HTML template'
          },
          {
            path: 'src/App.js',
            content: `import React from 'react';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>Welcome to ${name}</h1>\n        <p>Edit src/App.js and save to reload.</p>\n      </header>\n    </div>\n  );\n}\n\nexport default App;`,
            commitMessage: 'Add main App component'
          },
          {
            path: 'src/index.js',
            content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`,
            commitMessage: 'Add React entry point'
          },
          {
            path: 'src/App.css',
            content: `.App {\n  text-align: center;\n}\n\n.App-header {\n  background-color: #282c34;\n  padding: 20px;\n  color: white;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}`,
            commitMessage: 'Add basic styling'
          }
        );
        break;

      case 'python':
        files.push(
          {
            path: 'main.py',
            content: `#!/usr/bin/env python3\n\ndef main():\n    print("Hello, World!")\n    # Your code here\n\nif __name__ == "__main__":\n    main()`,
            commitMessage: 'Add main Python file'
          },
          {
            path: 'requirements.txt',
            content: `# Add your Python dependencies here\n# Example:\n# requests==2.28.1\n# numpy==1.21.0`,
            commitMessage: 'Add requirements.txt'
          },
          {
            path: '.gitignore',
            content: `__pycache__/\n*.py[cod]\n*$py.class\n*.so\n.Python\nbuild/\ndevelop-eggs/\ndist/\ndownloads/\neggs/\n.eggs/\nlib/\nlib64/\nparts/\nsdist/\nvar/\nwheels/\n*.egg-info/\n.installed.cfg\n*.egg\nPIPFILE.lock\n.env\n.venv\nenv/\nvenv/\nENV/\nenv.bak/\nvenv.bak/`,
            commitMessage: 'Add Python .gitignore'
          }
        );
        break;

      default:
        files.push(
          {
            path: 'README.md',
            content: `# ${name}\n\nDescription of the project.\n\n## Getting Started\n\nInstructions on how to get started with this project.\n\n## Usage\n\nHow to use this project.\n\n## Contributing\n\nGuidelines for contributing to this project.\n\n## License\n\nThis project is licensed under the MIT License.`,
            commitMessage: 'Add README.md'
          }
        );
    }

    if (!files.some(file => file.path === 'README.md')) {
      files.unshift({
        path: 'README.md',
        content: `# ${name}\n\nA ${projectType} project.\n\n## Installation\n\nInstallation instructions here.\n\n## Usage\n\nUsage instructions here.`,
        commitMessage: 'Add README.md'
      });
    }

    return await createMultipleFilesInRepository(repoName, files);

  } catch (error) {
    console.error('Error generating project structure:', error);
    return {
      content: [{
        text: `❌ Error generating project structure: ${error.message}`,
        type: 'text'
      }]
    };
  }
}
