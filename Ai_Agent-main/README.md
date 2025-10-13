# 🤖 AI Agent - Multi-Platform Social Media Assistant

A powerful, intelligent AI assistant that helps you interact across multiple platforms including social media, GitHub, and more. Built with React, Node.js, and integrated with Google's Gemini AI, this agent provides seamless automation for content creation and platform management.

## 🎬 Demo Video

<div align="center">

### 🚀 See AI Agent in Action

https://github.com/user-attachments/assets/a51a633c-9d5b-477c-ac63-1dbcb648d8d6

*Experience AI Agent's powerful capabilities including multi-platform social media posting, GitHub integration,  and intelligent automation - all through an intuitive chat interface.*

</div>

---

## ✨ Features

### 🚀 **Multi-Platform Social Media Integration**
- **Twitter/X**: Create, schedule, and manage tweets
- **Threads**: Post content and manage Meta's Threads platform
- **Multi-platform posting**: Simultaneously post to multiple platforms
- **Smart content optimization**: Automatically adjusts content for platform-specific character limits

### 🧠 **AI-Powered Intelligence**
- **Google Gemini AI Integration**: Advanced natural language processing
- **Voice Assistant**: Speech-to-text and voice interaction capabilities
- **Context-Aware Responses**: Maintains conversation history for better understanding
- **Smart Content Generation**: AI-generated posts, responses, and content optimization

### 🔧 **Developer Tools**
- **GitHub Integration**: Create repositories, manage files, and automate workflows
- **Model Context Protocol (MCP)**: Extensible tool system for custom integrations
- **Real-time Chat Interface**: Interactive conversation with the AI agent
- **Theme Support**: Dark/Light mode with customizable themes

### 🎨 **Modern UI/UX**
- **React 19**: Latest React features with modern hooks
- **Tailwind CSS**: Responsive, mobile-first design
- **React Icons**: Beautiful iconography throughout the interface
- **Sweet Alert 2**: Elegant notification system
- **Loading Animations**: Smooth user experience with Lottie animations

## 🏗️ Architecture

```
ai-agent/
├── 🎨 Frontend (React)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── contexts/       # React Context (Theme, Model)
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
├── 🚀 Server (Node.js)
│   ├── tools/              # Platform integrations
│   │   ├── twitter/        # Twitter API tools
│   │   ├── threads/        # Threads API tools
│   │   └── github/         # GitHub API tools
│   └── mcp.tools.js        # MCP tool definitions
└── 🔌 Client (Vercel)
    └── index.js            # Deployment configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for desired platforms (Twitter, Threads, GitHub, Gemini)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SumitGohil17/Ai_Agent.git
cd Ai_Agent
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd ai-agent
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Configuration**

Create `.env` files in both `ai-agent/` and `server/` directories:

**Frontend (.env):**
```env
REACT_APP_GEMINI_API=your_gemini_api_key_here
```

**Server (.env):**
```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Twitter/X API
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# Threads API
THREADS_ACCESS_TOKEN=your_threads_access_token
THREADS_USER_ID=your_threads_user_id

# GitHub API
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username

# Cloudinary (for media uploads)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Start the application**
```bash
# Start the frontend (from ai-agent directory)
npm start

# Start the server (from server directory)
npm start
```

The application will be available at `http://localhost:3000`

## 🔑 API Keys Setup

### Google Gemini AI
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to your environment variables

### Twitter/X API
1. Apply for Twitter Developer access
2. Create a new application
3. Generate API keys and access tokens

### Threads API
1. Access Meta Developer Portal
2. Create a Threads application
3. Generate access tokens

### GitHub API
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with appropriate permissions

### Cloudinary (Optional)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name and API credentials

## 🎯 Usage Examples

### Multi-Platform Posting
```javascript
// Post to both Twitter and Threads
"Create a post about AI innovation for twitter and threads"
```

### GitHub Repository Management
```javascript
// Create a new repository
"Create a GitHub repository called 'my-awesome-project'"
```


## 🛠️ Available Tools & Commands

The AI Agent comes with a comprehensive set of tools for automating various platform interactions. All tools support natural language commands and provide detailed feedback.

### 📱 **Social Media Tools**

#### 🐦 **Twitter/X Integration**
- **`createPost(text, imageData)`**
  - **Purpose**: Create and publish tweets with optional media
  - **Features**: 
    - 280 character limit enforcement
    - Image upload via Cloudinary integration
    - Automatic media optimization
    - Rate limiting protection
  - **Usage Examples**:
    ```
    "Tweet about the latest AI developments"
    "Post this image with caption: 'Beautiful sunset'"
    "Create a tweet: 'Just launched my new project! #coding'"
    ```

#### 🧵 **Threads Integration**
- **`createThreadsPost(text, mediaUrl, replyToPostId)`**
  - **Purpose**: Create posts on Meta's Threads platform
  - **Features**:
    - 500 character limit support
    - Media attachment capabilities
    - Reply functionality for threaded conversations
    - Cloudinary media processing
  - **Usage Examples**:
    ```
    "Post to Threads: 'Excited about the new features'"
    "Create a Threads post with this image about productivity"
    "Reply to the last post with: 'Thanks for the feedback!'"
    ```

- **`validateThreadsConfiguration()`**
  - **Purpose**: Verify Threads API credentials and user information
  - **Returns**: User profile details and configuration status

- **`getThreadsUserProfile()`**
  - **Purpose**: Fetch current user's Threads profile information
  - **Returns**: Username, bio, profile picture, and account details

- **`getThreadsUserPosts(limit)`**
  - **Purpose**: Retrieve recent posts from user's Threads account
  - **Parameters**: `limit` (default: 10) - number of posts to fetch

- **`createThreadsThread(posts[])`**
  - **Purpose**: Create a multi-post thread on Threads
  - **Features**: Automatic reply chaining between posts

- **`parseThreadsPrompt(prompt)`**
  - **Purpose**: AI-powered parsing of natural language into Threads post data
  - **Returns**: Extracted text, media URLs, hashtags, and mentions

#### 🚀 **Multi-Platform Operations**
- **`createMultiPlatformPost(text, platforms[], mediaUrl)`**
  - **Purpose**: Simultaneously post content across multiple social platforms
  - **Supported Platforms**: Twitter/X, Threads
  - **Features**:
    - Platform-specific character limit optimization
    - Parallel posting for efficiency
    - Individual platform error handling
    - Comprehensive success/failure reporting
  - **Usage Examples**:
    ```
    "Post to both Twitter and Threads: 'New blog post is live!'"
    "Share this announcement on all platforms"
    "Create a multi-platform post about our product launch"
    ```

- **`parseMultiPlatformPrompt(prompt)`**
  - **Purpose**: AI parsing for multi-platform posting requests
  - **Features**: Auto-detection of target platforms, content optimization

- **`checkPlatformConfigurations()`**
  - **Purpose**: Verify API credentials for all connected platforms
  - **Returns**: Detailed status report of platform availability

### 🔧 **Developer & GitHub Tools**

#### 📁 **Repository Management**
- **`createGitHubRepository(name, description, isPrivate, hasReadme, gitignoreTemplate, license)`**
  - **Purpose**: Create new GitHub repositories with full configuration
  - **Features**:
    - Public/private repository options
    - Automatic README generation
    - Pre-configured .gitignore templates
    - License selection (MIT, Apache, GPL, etc.)
    - Repository name sanitization
  - **Usage Examples**:
    ```
    "Create a GitHub repository called 'my-awesome-project'"
    "Make a private repo for 'client-work' with Node.js gitignore"
    "Create a public repository with MIT license for 'open-source-tool'"
    ```

- **`listGitHubRepositories(limit)`**
  - **Purpose**: Fetch and display user's GitHub repositories
  - **Features**: Sorted by most recent updates, detailed repository information
  - **Default**: Shows 10 most recent repositories

- **`parseRepositoryPrompt(prompt)`**
  - **Purpose**: AI-powered parsing of repository creation requests
  - **Features**: Extracts name, privacy settings, templates, and licenses

#### 📄 **File Management**
- **`createFileInRepository(repoName, filePath, content, commitMessage, branch)`**
  - **Purpose**: Create or update files in existing repositories
  - **Features**:
    - Automatic commit message generation
    - File existence checking (create vs. update)
    - Base64 encoding for GitHub API
    - Branch specification support
  - **Usage Examples**:
    ```
    "Add a README.md to my project repository"
    "Create a package.json file in 'my-node-app'"
    "Update the main.js file with new functionality"
    ```

- **`createMultipleFilesInRepository(repoName, files[], branch)`**
  - **Purpose**: Bulk create/update multiple files in a repository
  - **Features**:
    - Batch processing with individual error handling
    - Progress tracking and detailed reporting
    - Automatic retry logic

- **`parseFileCreationPrompt(prompt)`**
  - **Purpose**: AI parsing for file creation requests
  - **Features**: Extracts file paths, content, and commit messages

#### 🏗️ **Project Generation**
- **`generateProjectStructure(repoName, projectType, projectName)`**
  - **Purpose**: Generate complete project scaffolding
  - **Supported Types**: 
    - Node.js projects with package.json, gitignore, README
    - React applications with component structure
    - Python projects with requirements.txt and setup files
    - Generic projects with basic structure
  - **Usage Examples**:
    ```
    "Generate a Node.js project structure for 'api-server'"
    "Create a React project template in 'my-react-app'"
    "Set up a Python project for 'data-analysis-tool'"
    ```

### 🤖 **AI & Automation Tools**

#### 🧠 **Content Generation**
- **Google Gemini AI Integration**: All tools leverage Gemini AI for:
  - Natural language understanding
  - Content optimization for different platforms
  - Smart prompt parsing and interpretation
  - Context-aware responses

#### 📊 **Analytics & Tracking**
- **Database Integration**: All operations are logged with:
  - Timestamp tracking
  - Operation types and success rates
  - Platform usage analytics
  - Error monitoring and reporting

#### 🔍 **Smart Parsing**
- **Natural Language Processing**: Convert plain English into structured API calls
- **Context Awareness**: Understands user intent across different platforms
- **Error Recovery**: Graceful handling of API failures with helpful suggestions


### 💡 **Usage Tips**

1. **Natural Language**: Use conversational commands like "Post this to Twitter" or "Create a repo for my project"
2. **Platform Flexibility**: Tools auto-detect target platforms from context
3. **Batch Operations**: Combine multiple actions in a single request
4. **Media Support**: Include images by URL or upload directly
5. **Configuration Check**: Use validation tools to verify API setup before posting


### Manual Deployment
1. Build the frontend: `npm run build`
2. Deploy the build folder to your hosting provider
3. Deploy the server to a Node.js hosting service


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful AI capabilities
- [Model Context Protocol](https://modelcontextprotocol.io/) for extensible tool integration
- [React](https://reactjs.org/) for the amazing frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling




<div align="center">

**Built with ❤️ by [SumitGohil17](https://github.com/SumitGohil17)**

⭐ **Star this repository if you found it helpful!**

</div>
