import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import * as fs from 'fs/promises';
import { GoogleGenAI } from "@google/genai";
import * as path from 'path';

config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

async function makeThreadsAPIRequest(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${THREADS_API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        access_token: process.env.THREADS_ACCESS_TOKEN
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.data = data;
    }

    console.log('Making Threads API request:', {
      url: config.url,
      method: config.method,
      data: data ? JSON.stringify(data) : 'none'
    });

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Threads API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 400) {
      throw new Error(`Bad Request: ${error.response?.data?.error?.message || 'Invalid request parameters'}`);
    } else if (error.response?.status === 401) {
      throw new Error('Unauthorized: Invalid or expired access token');
    } else if (error.response?.status === 403) {
      throw new Error('Forbidden: Insufficient permissions or invalid user ID');
    } else if (error.response?.status === 404) {
      throw new Error('Not Found: User ID does not exist or endpoint not found');
    }
    
    throw new Error(`Threads API Error: ${error.response?.data?.error?.message || error.message}`);
  }
}

export async function validateThreadsConfiguration() {
  console.log('Validating Threads configuration...');
  
  try {
    if (!process.env.THREADS_ACCESS_TOKEN) {
      throw new Error('THREADS_ACCESS_TOKEN not configured');
    }
    
    if (!process.env.THREADS_USER_ID) {
      throw new Error('THREADS_USER_ID not configured');
    }

    const userInfo = await makeThreadsAPIRequest(
      `/${process.env.THREADS_USER_ID}?fields=id,username,name`
    );

    return {
      content: [{
        text: `✅ Threads Configuration Valid!\n\n` +
              `🧵 Configuration Details:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `• User ID: ${userInfo.id}\n` +
              `• Username: @${userInfo.username || 'Not available'}\n` +
              `• Display Name: ${userInfo.name || 'Not available'}\n` +
              `• Access Token: ****${process.env.THREADS_ACCESS_TOKEN.slice(-8)}\n\n` +
              `🚀 Ready to create Threads posts!\n\n` +
              `⏰ Validated at: ${new Date().toLocaleString()}`,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('Threads configuration validation failed:', error);
    return {
      content: [{
        text: `❌ Threads Configuration Invalid!\n\n` +
              `🔧 Configuration Issues:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `• Error: ${error.message}\n` +
              `• Access Token Set: ${process.env.THREADS_ACCESS_TOKEN ? '✅ Yes' : '❌ No'}\n` +
              `• User ID Set: ${process.env.THREADS_USER_ID ? '✅ Yes' : '❌ No'}\n` +
              `• Current User ID: ${process.env.THREADS_USER_ID || 'Not set'}\n\n` +
              `🔧 How to Fix:\n` +
              `1. Get your numeric User ID (not username)\n` +
              `2. Ensure access token has 'threads_basic' and 'threads_content_publish' permissions\n` +
              `3. Update your .env file with correct values\n\n` +
              `⏰ Checked at: ${new Date().toLocaleString()}`,
        type: 'text'
      }]
    };
  }
}

export async function createThreadsPost(text, imageData = null, replyToPostId = null) {
  console.log(`Creating Threads post: "${text}" with image: ${imageData ? 'Yes' : 'No'}`);
  
  try {
    if (!process.env.THREADS_ACCESS_TOKEN || !process.env.THREADS_USER_ID) {
      throw new Error('Threads API not configured. Please set THREADS_ACCESS_TOKEN and THREADS_USER_ID environment variables.');
    }

    if (!/^\d+$/.test(process.env.THREADS_USER_ID)) {
      throw new Error(`THREADS_USER_ID must be a numeric ID, not a username. Current value: "${process.env.THREADS_USER_ID}"`);
    }

    if (text.length > 500) {
      console.warn('Text exceeds 500 characters, truncating...');
      text = text.substring(0, 497) + '...';
    }

    let cloudinaryUrl = null;
    if (imageData) {
      try {
        console.log('Processing image for Threads upload...');
        
        // Upload to Cloudinary first
        console.log('Uploading image to Cloudinary...');
        
        const uploadOptions = {
          folder: 'threads_images',
          public_id: `threads_${Date.now()}`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        };

        let uploadResult;
        
        if (typeof imageData === 'string') {
          if (imageData.startsWith('data:')) {
            uploadResult = await cloudinary.uploader.upload(imageData, uploadOptions);
          } else if (imageData.startsWith('http')) {
            uploadResult = await cloudinary.uploader.upload(imageData, uploadOptions);
          } else {
            throw new Error('Invalid image data format. Please provide base64 data URL or HTTP URL.');
          }
        } else {
          throw new Error('Invalid image data format. Expected base64 string or URL.');
        }

        cloudinaryUrl = uploadResult.secure_url;
        console.log('Image uploaded to Cloudinary successfully for Threads:', cloudinaryUrl);
        
      } catch (mediaError) {
        console.error('Error processing image for Threads:', mediaError);
        cloudinaryUrl = null;
      }
    }

    const postData = {
      media_type: cloudinaryUrl ? 'IMAGE' : 'TEXT',
      text: text
    };

    if (cloudinaryUrl) {
      postData.image_url = cloudinaryUrl;
    }

    if (replyToPostId) {
      postData.reply_to_id = replyToPostId;
    }

    console.log('Creating Threads media container with data:', postData);
    
    const containerResponse = await makeThreadsAPIRequest(
      `/${process.env.THREADS_USER_ID}/threads`,
      'POST',
      postData
    );

    const containerId = containerResponse.id;
    console.log('Media container created:', containerId);

    console.log('Publishing Threads post...');
    const publishResponse = await makeThreadsAPIRequest(
      `/${process.env.THREADS_USER_ID}/threads_publish`,
      'POST',
      {
        creation_id: containerId
      }
    );

    const postId = publishResponse.id;
    console.log('Threads post published:', postId);

    const db = await readDb();
    db.analytics.queries.push({
      type: 'threads_post_creation',
      is_reply: !!replyToPostId,
      has_media: !!cloudinaryUrl,
      text_length: text.length,
      timestamp: new Date().toISOString()
    });
    await writeDb(db);

    const postUrl = `https://threads.net/@${process.env.THREADS_USER_ID || 'user'}/post/${postId}`;

    return {
      content: [{
        text: `✅ Successfully posted to Threads!\n\n` +
              `🧵 Post Details:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `• Type: ${replyToPostId ? 'Reply' : 'New Post'}\n` +
              `• Text: "${text.length > 100 ? text.substring(0, 100) + '...' : text}"\n` +
              `• Characters: ${text.length}/500\n` +
              `• Media: ${cloudinaryUrl ? '✅ Included' : '❌ None'}\n` +
              `${cloudinaryUrl ? `• Cloudinary URL: ${cloudinaryUrl}\n` : ''}` +
              `• Post ID: ${postId}\n` +
              `• Container ID: ${containerId}\n` +
              `• Post URL: ${postUrl}\n` +
              `• Created: ${new Date().toLocaleString()}\n\n` +
              `🚀 Your post is now live on Threads!\n\n` +
              `⏰ Posted at: ${new Date().toLocaleString()}`,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('Threads Post Creation Error:', error);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error.message?.includes('numeric ID')) {
      errorMessage = error.message;
    } else if (error.message?.includes('access_token') || error.message?.includes('Unauthorized')) {
      errorMessage = 'Invalid or expired Threads access token. Please check your THREADS_ACCESS_TOKEN.';
    } else if (error.message?.includes('Forbidden') || error.message?.includes('permissions')) {
      errorMessage = 'Insufficient permissions. Ensure your access token has "threads_basic" and "threads_content_publish" scopes.';
    } else if (error.message?.includes('Not Found') || error.message?.includes('does not exist')) {
      errorMessage = 'Invalid THREADS_USER_ID. Please use your numeric user ID, not your username.';
    } else if (error.message?.includes('rate limit') || error.message?.includes('limit exceeded')) {
      errorMessage = 'Threads rate limit exceeded. Please wait before trying again.';
    } else if (error.message?.includes('media')) {
      errorMessage = 'Media upload failed. Please check the media URL or format.';
    } else if (error.message?.includes('character limit')) {
      errorMessage = 'Text exceeds Threads character limit (500 characters).';
    } else {
      errorMessage = error.message || 'Failed to create Threads post';
    }
    
    return {
      content: [{
        text: `❌ Error creating Threads post: ${errorMessage}\n\n` +
              `🔧 Common Solutions:\n` +
              `• Check that THREADS_USER_ID is numeric\n` +
              `• Verify access token has correct permissions\n` +
              `• Ensure you're using a valid Threads Business account\n` +
              `• Try the validateThreadsConfiguration tool first\n\n` +
              `Please check your Threads API configuration and try again.`,
        type: 'text'
      }]
    };
  }
}

export async function parseThreadsPrompt(prompt) {
  console.log(`Parsing Threads post prompt: "${prompt}"`);
  
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return parseThreadsPromptFallback(prompt);
    }

    const parsePrompt = `Parse the following user request for creating a Threads post and extract the information in JSON format:

{
  "text": "The text content for the post (max 500 characters)",
  "mediaUrl": "URL of media to include (null if no media)",
  "hashtags": ["hashtag1", "hashtag2"],
  "mentions": ["@username1", "@username2"],
  "isReply": false,
  "replyToPostId": null
}

Rules:
1. Extract or generate engaging text content
2. Identify any media URLs mentioned
3. Extract hashtags (without #) and mentions (without @)
4. Determine if this is a reply to another post
5. Keep text under 500 characters (Threads limit)
6. If no specific text is provided, create engaging content based on the context
7. Include relevant hashtags naturally in the text

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
        if (finalText.length + mentionsText.length + 2 <= 500) {
          finalText += '\n\n' + mentionsText;
        }
      }
      
      if (parsedData.hashtags && parsedData.hashtags.length > 0) {
        const hashtagsText = parsedData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');
        if (finalText.length + hashtagsText.length + 2 <= 500) {
          finalText += '\n\n' + hashtagsText;
        }
      }
      
      return {
        text: finalText.substring(0, 500),
        mediaUrl: parsedData.mediaUrl || null,
        isReply: parsedData.isReply || false,
        replyToPostId: parsedData.replyToPostId || null
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return parseThreadsPromptFallback(prompt);
    }

  } catch (error) {
    console.error('Error parsing Threads prompt with Gemini:', error);
    return parseThreadsPromptFallback(prompt);
  }
}

function parseThreadsPromptFallback(prompt) {

  const urlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|mp4|mov))/i;
  const mediaMatch = prompt.match(urlRegex);
  const mediaUrl = mediaMatch ? mediaMatch[1] : null;

  const hashtagRegex = /#(\w+)/g;
  const hashtags = [...prompt.matchAll(hashtagRegex)].map(match => match[1]);

  const mentionRegex = /@(\w+)/g;
  const mentions = [...prompt.matchAll(mentionRegex)].map(match => match[1]);

  const isReply = prompt.toLowerCase().includes('reply') || prompt.toLowerCase().includes('respond');

  let text = prompt
    .replace(urlRegex, '') 
    .replace(/create|post|threads|reply|respond/gi, '') 
    .trim() || 'New post created via AI Agent';

  if (mentions.length > 0) {
    const mentionsText = mentions.map(m => `@${m}`).join(' ');
    if (text.length + mentionsText.length + 2 <= 500) {
      text += '\n\n' + mentionsText;
    }
  }
  
  if (hashtags.length > 0) {
    const hashtagsText = hashtags.map(h => `#${h}`).join(' ');
    if (text.length + hashtagsText.length + 2 <= 500) {
      text += '\n\n' + hashtagsText;
    }
  }
  
  return {
    text: text.substring(0, 500),
    mediaUrl,
    isReply,
    replyToPostId: null
  };
}

export async function getThreadsUserProfile() {
  console.log('Fetching Threads user profile...');
  
  try {
    if (!process.env.THREADS_ACCESS_TOKEN || !process.env.THREADS_USER_ID) {
      throw new Error('Threads API not configured. Please set THREADS_ACCESS_TOKEN and THREADS_USER_ID.');
    }

    const userInfo = await makeThreadsAPIRequest(
      `/${process.env.THREADS_USER_ID}?fields=id,username,name,threads_profile_picture_url,threads_biography`
    );

    return {
      content: [{
        text: `🧵 Threads Profile Information:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `• User ID: ${userInfo.id}\n` +
              `• Username: @${userInfo.username || 'Not available'}\n` +
              `• Display Name: ${userInfo.name || 'Not available'}\n` +
              `• Biography: ${userInfo.threads_biography || 'No bio available'}\n` +
              `• Profile Picture: ${userInfo.threads_profile_picture_url ? '✅ Available' : '❌ Not available'}\n` +
              `• Profile URL: https://threads.net/@${userInfo.username || process.env.THREADS_USER_ID}\n\n` +
              `⏰ Retrieved at: ${new Date().toLocaleString()}`,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('Error fetching Threads profile:', error);
    return {
      content: [{
        text: `❌ Error fetching Threads profile: ${error.message}`,
        type: 'text'
      }]
    };
  }
}

export async function getThreadsUserPosts(limit = 10) {
  console.log('Fetching Threads user posts...');
  
  try {
    if (!process.env.THREADS_ACCESS_TOKEN || !process.env.THREADS_USER_ID) {
      throw new Error('Threads API not configured. Please set THREADS_ACCESS_TOKEN and THREADS_USER_ID.');
    }

    const response = await makeThreadsAPIRequest(
      `/${process.env.THREADS_USER_ID}/threads?fields=id,media_type,media_url,text,timestamp,permalink&limit=${limit}`
    );

    const posts = response.data || [];

    if (posts.length === 0) {
      return {
        content: [{
          text: `🧵 No posts found in your Threads account.`,
          type: 'text'
        }]
      };
    }

    let postsList = `🧵 Your Recent Threads Posts (${posts.length} posts):\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    posts.forEach((post, index) => {
      const postDate = new Date(post.timestamp).toLocaleDateString();
      const postText = post.text ? 
        (post.text.length > 80 ? post.text.substring(0, 80) + '...' : post.text) : 
        'No text content';
      
      postsList += `${index + 1}. **${post.media_type || 'TEXT'} Post**\n` +
                   `   "${postText}"\n` +
                   `   🔗 ${post.permalink || 'URL not available'}\n` +
                   `   📅 ${postDate}\n` +
                   `   🆔 ${post.id}\n\n`;
    });

    postsList += `⏰ Retrieved at: ${new Date().toLocaleString()}`;

    return {
      content: [{
        text: postsList,
        type: 'text'
      }]
    };

  } catch (error) {
    console.error('Error fetching Threads posts:', error);
    return {
      content: [{
        text: `❌ Error fetching Threads posts: ${error.message}`,
        type: 'text'
      }]
    };
  }
}

export async function createThreadsThread(posts) {
  console.log(`Creating thread with ${posts.length} posts`);
  
  try {
    if (!process.env.THREADS_ACCESS_TOKEN || !process.env.THREADS_USER_ID) {
      throw new Error('Threads API not configured. Please set THREADS_ACCESS_TOKEN and THREADS_USER_ID.');
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      throw new Error('Posts array is required and must not be empty.');
    }

    const results = [];
    let parentPostId = null;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      try {
        let result;
        
        if (i === 0) {

          result = await createThreadsPost(
            post.text.substring(0, 500),
            post.mediaUrl
          ); 
          parentPostId = 'extracted_post_id'; 
        } else {
          result = await createThreadsPost(
            post.text.substring(0, 500),
            post.mediaUrl,
            parentPostId
          );
        }
        
        results.push({ success: true, post: i + 1, result });
        
        if (i < posts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        results.push({ success: false, post: i + 1, error: error.message });
        break; 
      }
    }


    const db = await readDb();
    db.analytics.queries.push({
      type: 'threads_thread_creation',
      total_posts: posts.length,
      successful_posts: results.filter(r => r.success).length,
      timestamp: new Date().toISOString()
    });
    await writeDb(db);

    const successCount = results.filter(r => r.success).length;

    let summary = `🧵 Thread Creation Results:\n` +
                  `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                  `• Total Posts: ${posts.length}\n` +
                  `• Successful: ${successCount}\n` +
                  `• Failed: ${posts.length - successCount}\n\n`;

    results.forEach((result, index) => {
      if (result.success) {
        summary += `✅ Post ${index + 1}: Created successfully\n`;
      } else {
        summary += `❌ Post ${index + 1}: Error - ${result.error}\n`;
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
    console.error('Thread Creation Error:', error);
    return {
      content: [{
        text: `❌ Error creating thread: ${error.message}`,
        type: 'text'
      }]
    };
  }
}
