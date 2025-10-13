import { config } from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs/promises';
import * as path from 'path';
import * as TwitterTools from './tools/twitter/tweetMcpTool.js';
import * as ThreadsTools from './tools/threads/threadMcpTool.js';
import * as GitHubTools from './tools/github/gitMcpTools.js';

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

//Twitter tools
export const createPost = TwitterTools.createPost;

//Threads tools
export const createThreadsPost = ThreadsTools.createThreadsPost;
export const validateThreadsConfiguration = ThreadsTools.validateThreadsConfiguration;
export const getThreadsUserProfile = ThreadsTools.getThreadsUserProfile;
export const parseThreadsPrompt = ThreadsTools.parseThreadsPrompt;
export const getThreadsUserPosts = ThreadsTools.getThreadsUserPosts;
export const createThreadsThread = ThreadsTools.createThreadsThread;

// GitHub tools
export const createGitHubRepository = GitHubTools.createGitHubRepository;
export const listGitHubRepositories = GitHubTools.listGitHubRepositories;
export const createFileInRepository = GitHubTools.createFileInRepository;
export const parseRepositoryPrompt = GitHubTools.parseRepositoryPrompt;
export const createMultipleFilesInRepository = GitHubTools.createMultipleFilesInRepository;
export const parseFileCreationPrompt = GitHubTools.parseFileCreationPrompt;
export const generateProjectStructure = GitHubTools.generateProjectStructure;

export async function createMultiPlatformPost(text, platforms = ['twitter', 'threads'], mediaUrl = null) {
  console.log(`Creating multi-platform post for: ${platforms.join(', ')}`);
  
  try {
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    const postPromises = [];

    if (platforms.includes('twitter') || platforms.includes('x')) {
      const twitterPromise = (async () => {
        try {
          console.log('Posting to Twitter/X...');
          
          const twitterText = text.length > 280 ? text.substring(0, 277) + '...' : text;
          
          const twitterResult = await createPost(twitterText);
          console.log('✅ Successfully posted to Twitter/X');
          
          return {
            platform: 'Twitter/X',
            success: true,
            result: twitterResult,
            text: twitterText
          };
        } catch (error) {
          console.error('❌ Failed to post to Twitter/X:', error.message);
          return {
            platform: 'Twitter/X',
            success: false,
            error: error.message,
            text: text.length > 280 ? text.substring(0, 277) + '...' : text
          };
        }
      })();
      
      postPromises.push(twitterPromise);
    }

    if (platforms.includes('threads')) {
      const threadsPromise = (async () => {
        try {
          
          const threadsText = text.length > 500 ? text.substring(0, 497) + '...' : text;
          
          const threadsResult = await createThreadsPost(threadsText, mediaUrl);
          
          return {
            platform: 'Threads',
            success: true,
            result: threadsResult,
            text: threadsText
          };
        } catch (error) {
          console.error('❌ Failed to post to Threads:', error.message);
          return {
            platform: 'Threads',
            success: false,
            error: error.message,
            text: text.length > 500 ? text.substring(0, 497) + '...' : text
          };
        }
      })();
      
      postPromises.push(threadsPromise);
    }

    console.log(`Executing ${postPromises.length} posts in parallel...`);
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Posts execution timeout after 25 seconds')), 25000);
    });

    try {
      const allResults = await Promise.race([
        Promise.allSettled(postPromises),
        timeoutPromise
      ]);

      // Process results
      allResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          if (result.value.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } else {
          const platform = platforms[index] === 'twitter' ? 'Twitter/X' : platforms[index];
          results.push({
            platform: platform,
            success: false,
            error: result.reason?.message || 'Unknown error',
            text: text
          });
          errorCount++;
        }
      });

    } catch (timeoutError) {
      console.error('Timeout error during multi-platform posting:', timeoutError);
      
      // Return immediate response for timeout
      return {
        content: [{
          text: `⏱️ Multi-Platform Posting Timeout\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `🚀 Posts are being processed in the background...\n\n` +
                `📊 Status:\n` +
                `• Target Platforms: ${platforms.join(', ')}\n` +
                `• Posts Initiated: ${postPromises.length}\n` +
                `• Text: "${text.length > 100 ? text.substring(0, 100) + '...' : text}"\n` +
                `• Length: ${text.length} characters\n` +
                `• Media: ${mediaUrl ? '✅ Included' : '❌ None'}\n\n` +
                `⚠️ Note: Due to API response times, posts may still be processing.\n` +
                `Check your social media accounts to confirm successful posting.\n\n` +
                `⏰ Initiated at: ${new Date().toLocaleString()}`,
          type: 'text'
        }]
      };
    }

    try {
      const db = await readDb();
      db.analytics.queries.push({
        type: 'multi_platform_post',
        platforms: platforms,
        success_count: successCount,
        error_count: errorCount,
        text_length: text.length,
        has_media: !!mediaUrl,
        timestamp: new Date().toISOString()
      });
      await writeDb(db);
    } catch (dbError) {
      console.warn('Failed to update analytics:', dbError.message);
    }

    let summary = `🚀 Multi-Platform Posting Results\n` +
                  `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                  `📊 Quick Summary:\n` +
                  `• Successful: ${successCount}/${platforms.length}\n` +
                  `• Failed: ${errorCount}/${platforms.length}\n\n`;

    results.forEach((result) => {
      if (result.success) {
        summary += `✅ ${result.platform}: Posted successfully\n`;
      } else {
        summary += `❌ ${result.platform}: ${result.error.substring(0, 50)}...\n`;
      }
    });

    if (successCount === platforms.length) {
      summary += `\n🎉 All platforms posted successfully!\n`;
    } else if (successCount > 0) {
      summary += `\n⚠️ Partial success: ${successCount}/${platforms.length} platforms.\n`;
    } else {
      summary += `\n💥 All posts failed. Check API configurations.\n`;
    }

    summary += `\n⏰ Completed at: ${new Date().toLocaleString()}`;

    return {
      content: [{
        text: summary,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('Multi-Platform Posting Error:', error);
    return {
      content: [{
        text: `❌ Error in multi-platform posting: ${error.message}\n\n` +
              `Please check your API configurations and try again.\n\n` +
              `⏰ Error at: ${new Date().toLocaleString()}`,
        type: 'text'
      }]
    };
  }
}

export async function createQuickMultiPlatformPost(text, platforms = ['twitter', 'threads'], mediaUrl = null) {
  console.log(`Creating quick multi-platform post for: ${platforms.join(', ')}`);
  
  const acknowledgment = {
    content: [{
      text: `🚀 Multi-Platform Post Initiated!\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `📊 Processing:\n` +
            `• Platforms: ${platforms.join(', ')}\n` +
            `• Text: "${text.length > 100 ? text.substring(0, 100) + '...' : text}"\n` +
            `• Length: ${text.length} characters\n` +
            `• Media: ${mediaUrl ? '✅ Included' : '❌ None'}\n\n` +
            `⚡ Posts are being created now...\n` +
            `Check your social media accounts in a few moments.\n\n` +
            `⏰ Initiated at: ${new Date().toLocaleString()}`,
      type: 'text'
    }]
  };

  createMultiPlatformPost(text, platforms, mediaUrl)
    .then((result) => {
      console.log('Background multi-platform posting completed:', result);
    })
    .catch((error) => {
      console.error('Background multi-platform posting failed:', error);
    });

  return acknowledgment;
}

export async function parseMultiPlatformPrompt(prompt) {
  console.log(`Parsing multi-platform posting prompt: "${prompt}"`);
  
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return parseMultiPlatformPromptFallback(prompt);
    }

    const parsePrompt = `Parse the following user request for creating posts across multiple social media platforms and extract the information in JSON format:

{
  "text": "The text content for the post",
  "platforms": ["twitter", "threads"],
  "mediaUrl": "URL of media to include (null if no media)",
  "hashtags": ["hashtag1", "hashtag2"],
  "mentions": ["@username1", "@username2"]
}

Rules:
1. Extract or generate engaging text content suitable for social media
2. Identify which platforms to post to (twitter/x, threads, instagram, etc.)
3. If no platforms specified, default to ["twitter", "threads"]
4. Extract hashtags and mentions
5. Identify any media URLs
6. Optimize text for social media engagement
7. Consider character limits for different platforms

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

      let finalText = parsedData.text || 'New post created via AI Agent';
      
      if (parsedData.mentions && parsedData.mentions.length > 0) {
        const mentionsText = parsedData.mentions.map(m => m.startsWith('@') ? m : `@${m}`).join(' ');
        if (finalText.length + mentionsText.length + 2 <= 280) { // Twitter limit check
          finalText += '\n\n' + mentionsText;
        }
      }
      
      if (parsedData.hashtags && parsedData.hashtags.length > 0) {
        const hashtagsText = parsedData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');
        if (finalText.length + hashtagsText.length + 2 <= 280) { 
          finalText += '\n\n' + hashtagsText;
        }
      }
      
      const platforms = (parsedData.platforms || ['twitter', 'threads']).map(p => {
        if (p.toLowerCase() === 'x') return 'twitter';
        if (p.toLowerCase() === 'twitter') return 'twitter';
        if (p.toLowerCase() === 'threads') return 'threads';
        return p.toLowerCase();
      });
      
      return {
        text: finalText,
        platforms: platforms,
        mediaUrl: parsedData.mediaUrl || null
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return parseMultiPlatformPromptFallback(prompt);
    }

  } catch (error) {
    console.error('Error parsing multi-platform prompt with Gemini:', error);
    return parseMultiPlatformPromptFallback(prompt);
  }
}

function parseMultiPlatformPromptFallback(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  const platforms = [];
  if (lowerPrompt.includes('twitter') || lowerPrompt.includes('x')) {
    platforms.push('twitter');
  }
  if (lowerPrompt.includes('threads')) {
    platforms.push('threads');
  }
  if (lowerPrompt.includes('instagram')) {
    platforms.push('instagram');
  }
  
  if (platforms.length === 0) {
    platforms.push('twitter', 'threads');
  }

  const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|mp4|mov))/i;
  const mediaMatch = prompt.match(urlRegex);
  const mediaUrl = mediaMatch ? mediaMatch[1] : null;

  const hashtagRegex = /#(\w+)/g;
  const hashtags = [...prompt.matchAll(hashtagRegex)].map(match => match[1]);

  const mentionRegex = /@(\w+)/g;
  const mentions = [...prompt.matchAll(mentionRegex)].map(match => match[1]);

  let text = prompt
    .replace(urlRegex, '') // Remove URLs
    .replace(/post|create|share|twitter|threads|instagram|on|to/gi, '') 
    .trim() || 'New post created via AI Agent';
  

  if (mentions.length > 0) {
    const mentionsText = mentions.map(m => `@${m}`).join(' ');
    if (text.length + mentionsText.length + 2 <= 280) {
      text += '\n\n' + mentionsText;
    }
  }
  
  if (hashtags.length > 0) {
    const hashtagsText = hashtags.map(h => `#${h}`).join(' ');
    if (text.length + hashtagsText.length + 2 <= 280) {
      text += '\n\n' + hashtagsText;
    }
  }
  
  return {
    text: text.substring(0, 280),
    platforms,
    mediaUrl
  };
}

export async function checkPlatformConfigurations() {
  console.log('Checking social media platform configurations...');
  
  const configs = {
    twitter: {
      configured: !!(process.env.TWITTER_API_KEY && 
                    process.env.TWITTER_API_SECRET && 
                    process.env.TWITTER_ACCESS_TOKEN && 
                    process.env.TWITTER_ACCESS_SECRET),
      required: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET']
    },
    threads: {
      configured: !!(process.env.THREADS_ACCESS_TOKEN && process.env.THREADS_USER_ID),
      required: ['THREADS_ACCESS_TOKEN', 'THREADS_USER_ID']
    },
    github: {
      configured: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME),
      required: ['GITHUB_TOKEN', 'GITHUB_USERNAME']
    }
  };

  let configReport = `🔧 Platform Configuration Status\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  Object.entries(configs).forEach(([platform, config]) => {
    const status = config.configured ? '✅ Configured' : '❌ Not Configured';
    configReport += `📱 ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${status}\n`;
    
    if (!config.configured) {
      configReport += `   Missing: ${config.required.join(', ')}\n`;
    }
    configReport += '\n';
  });

  const configuredPlatforms = Object.entries(configs)
    .filter(([_, config]) => config.configured)
    .map(([platform, _]) => platform);

  configReport += `🚀 Available Platforms: ${configuredPlatforms.length > 0 ? configuredPlatforms.join(', ') : 'None'}\n`;
  configReport += `⚠️ Unavailable Platforms: ${Object.keys(configs).filter(p => !configs[p].configured).join(', ') || 'None'}\n\n`;
  configReport += `⏰ Checked at: ${new Date().toLocaleString()}`;

  return {
    content: [{
      text: configReport,
      type: 'text'
    }]
  };
}