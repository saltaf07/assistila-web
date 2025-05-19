
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Configure the Google AI plugin to use an API key from an environment variable.
// Make sure you have GEMINI_API_KEY set in your .env.local file for local development,
// and in your deployment environment's settings.
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY })
  ],
  // You can still set a default model here, or specify it per-flow/prompt.
  // If a model is specified in a prompt, it will override this default.
  // model: 'googleai/gemini-2.0-flash', // Example default model
});
