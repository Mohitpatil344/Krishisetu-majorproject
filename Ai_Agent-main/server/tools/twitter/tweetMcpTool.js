import { config } from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs/promises';
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

export async function createPost(status, imageData = null) {
    try {
        if (!process.env.TWITTER_API_KEY || 
            !process.env.TWITTER_API_SECRET || 
            !process.env.TWITTER_ACCESS_TOKEN || 
            !process.env.TWITTER_ACCESS_SECRET) {
            throw new Error('Twitter API credentials not properly configured');
        }
        
        const twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });
        
        const rwClient = twitterClient.readWrite;
        
        let mediaIds = [];
        let cloudinaryUrl = null;
        
        if (imageData) {
            try {
                
                const uploadOptions = {
                    folder: 'images',
                    public_id: `post_${Date.now()}`,
                    transformation: [
                        { width: 1200, height: 1200, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                };

                let uploadResult;
                
                if (typeof imageData === 'string') {
                    if (imageData.startsWith('data:')) {
                        // Base64 data URL - upload directly to Cloudinary
                        uploadResult = await cloudinary.uploader.upload(imageData, uploadOptions);
                    } else if (imageData.startsWith('http')) {
                        // Remote URL - upload to Cloudinary
                        uploadResult = await cloudinary.uploader.upload(imageData, uploadOptions);
                    } else {
                        throw new Error('Invalid image data format. Please provide base64 data URL or HTTP URL.');
                    }
                } else {
                    throw new Error('Invalid image data format. Expected base64 string or URL.');
                }

                cloudinaryUrl = uploadResult.secure_url;
                console.log('Image uploaded to Cloudinary successfully:', cloudinaryUrl);
                
                console.log('Downloading image from Cloudinary for Twitter upload...');
                const response = await axios.get(cloudinaryUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                const mediaBuffer = Buffer.from(response.data);
                
                let mimeType = 'image/jpeg';
                const contentType = response.headers['content-type'];
                if (contentType) {
                    mimeType = contentType;
                }
                
                console.log(`Uploading media to Twitter (${mediaBuffer.length} bytes, ${mimeType})`);
                
                const mediaUpload = await rwClient.v1.uploadMedia(mediaBuffer, { 
                    mimeType: mimeType,
                    target: 'tweet'
                });
                
                mediaIds.push(mediaUpload);
                console.log('Media uploaded to Twitter successfully, ID:', mediaUpload);
                
            } catch (mediaError) {
                console.error('Error processing image:', mediaError);
                
                if (mediaError.message?.includes('Unauthorized')) {
                    console.warn('Cloudinary authentication failed, proceeding without image');
                } else if (mediaError.message?.includes('timeout')) {
                    console.warn('Image processing timed out, proceeding without image');
                } else if (mediaError.message?.includes('Invalid image')) {
                    console.warn('Invalid image format, proceeding without image');
                } else {
                    console.warn('Image processing failed, proceeding without image:', mediaError.message);
                }
            }
        }
        
        const tweetOptions = { text: status };
        if (mediaIds.length > 0) {
            tweetOptions.media = { media_ids: mediaIds };
        }
        
        console.log('Creating tweet with options:', { 
            text: status.substring(0, 50) + '...', 
            hasMedia: mediaIds.length > 0 
        });
        
        const newPost = await rwClient.v2.tweet(tweetOptions);
        
        const db = await readDb();
        db.analytics.queries.push({
            type: 'tweet_creation',
            tweet_length: status.length,
            has_media: mediaIds.length > 0,
            has_cloudinary_upload: !!cloudinaryUrl,
            timestamp: new Date().toISOString()
        });
        await writeDb(db);
        
        return {
            content: [{
                text: `✅ Successfully posted to X/Twitter!\n\n` +
                      `🐦 Tweet Details:\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                      `• Content: "${status}"\n` +
                      `• Characters: ${status.length}/280\n` +
                      `• Tweet ID: ${newPost.data.id}\n` +
                      `• URL: https://twitter.com/i/web/status/${newPost.data.id}\n` +
                      `• Media: ${mediaIds.length > 0 ? '✅ Included' : '❌ None'}\n` +
                      `${cloudinaryUrl ? `• Cloudinary URL: ${cloudinaryUrl}\n` : ''}` +
                      `• Image Processing: ${cloudinaryUrl ? '✅ Uploaded to Cloudinary' : '❌ No image'}\n\n` +
                      `🚀 Your tweet is now live!\n\n` +
                      `⏰ Posted at: ${new Date().toLocaleString()}`,
                type: 'text'
            }],
        };
    } catch (error) {
        console.error('Twitter API Error:', error);
        
        let errorMessage = 'An error occurred when posting to Twitter.';
        
        if (error.code === 403) {
            errorMessage = 'Twitter returned a 403 Forbidden error. Your API keys may be invalid or your app lacks write permissions.';
        } else if (error.code === 429) {
            errorMessage = 'Twitter rate limit exceeded. Please try again later.';
        } else if (error.message && error.message.includes('credentials')) {
            errorMessage = 'Twitter API credentials are invalid or missing.';
        } else if (error.message && error.message.includes('media_category')) {
            errorMessage = 'Twitter media upload error. The image format may not be supported or the file is corrupted.';
        } else if (error.message && error.message.includes('Cloudinary')) {
            errorMessage = `Image upload failed: ${error.message}`;
        } else {
            errorMessage = error.message || 'Failed to create tweet';
        }
        
        return {
            content: [{
                text: `❌ Error posting to Twitter: ${errorMessage}`,
                type: 'text'
            }],
        };
    }
}