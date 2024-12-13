import { Pegasus } from './pegasus.js';

export const config = {
  runtime: 'edge',
};

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const pegasus = new Pegasus(OLLAMA_API_URL);

export default async function handler(req) {
  if (req.method === 'GET' && new URL(req.url).pathname === '/') {
    return new Response(JSON.stringify({ message: 'Welcome to Pegasus AI API' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST' && new URL(req.url).pathname === '/api/chat') {
    const { message } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const response = await pegasus.generate_response(message);
      return new Response(JSON.stringify({ response }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in chat route:', error);
      return new Response(JSON.stringify({ error: 'An error occurred while processing your request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (req.method === 'POST' && new URL(req.url).pathname === '/api/clear') {
    pegasus.clear_conversation_history();
    return new Response(JSON.stringify({ message: 'Conversation history cleared' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
