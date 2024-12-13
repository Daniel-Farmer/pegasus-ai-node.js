import { Pegasus } from './pegasus.js';
import fs from 'fs';
import path from 'path';

export const config = {
  runtime: 'edge'
};

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const pegasus = new Pegasus(OLLAMA_API_URL);

// Read the HTML file
const htmlPath = path.join(process.cwd(), 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === 'GET' && path === '/') {
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } else if (req.method === 'POST' && path === '/api/chat') {
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
  } else if (req.method === 'POST' && path === '/api/clear') {
    pegasus.clear_conversation_history();
    return new Response(JSON.stringify({ message: 'Conversation history cleared' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
