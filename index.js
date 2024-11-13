import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import fs from 'fs';

process.env.GOOGLE_GENERATIVE_AI_API_KEY = '';

// Define simple output structure
const Summary = z.object({
  summary: z.string(),
  mainTopics: z.array(z.string())
});

// Process PDF
async function main() {
    try {
      const response = await generateObject({
        model: google('gemini-1.5-flash-latest', {
            structuredOutputs: false,
        }),
        schema: Summary,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Provide a summary and main topics from this document',
              },
              {
                type: 'file',
                data: fs.readFileSync('./gemini.pdf'),
                mimeType: 'application/pdf',
              },
            ],
          },
        ],
      });

      const result = response.object;
  
      console.log('Full result:', result);
  
      if (!result || !result.mainTopics) {
        console.error('Invalid response structure:', result);
        return;
      }
  
      console.log('Summary:', result.summary);
      console.log('\nMain Topics:');
      result.mainTopics.forEach((topic, index) => {
        console.log(`${index + 1}. ${topic}`);
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  }

  main().catch(console.error);