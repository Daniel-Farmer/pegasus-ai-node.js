import { Pegasus } from './pegasus.js';

export const config = {
  runtime: 'edge'
};

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const pegasus = new Pegasus(OLLAMA_API_URL);

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pegasus AI Chat</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        #chatbox { height: 300px; border: 1px solid #ddd; overflow-y: scroll; padding: 10px; margin-bottom: 10px; }
        #userinput { width: 70%; padding: 5px; }
        #sendbtn { padding: 5px 15px; }
        .user { color: blue; }
        .assistant { color: green; }
    </style>
</head>
<body>
    <h1>Pegasus AI Chat</h1>
    <div id="chatbox"></div>
    <input type="text" id="userinput" placeholder="Type your message here...">
    <button id="sendbtn">Send</button>
    <button id="clearbtn">Clear History</button>

    <script>
        const chatbox = document.getElementById('chatbox');
        const userinput = document.getElementById('userinput');
        const sendbtn = document.getElementById('sendbtn');
        const clearbtn = document.getElementById('clearbtn');

        sendbtn.onclick = async () => {
            const message = userinput.value;
            if (message) {
                appendMessage('user', message);
                userinput.value = '';
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                    const data = await response.json();
                    appendMessage('assistant', data.response);
                } catch (error) {
                    console.error('Error:', error);
                    appendMessage('assistant', 'Sorry, an error occurred.');
                }
            }
        };

        clearbtn.onclick = async () => {
            await fetch('/api/clear', { method: 'POST' });
            chatbox.innerHTML = '';
        };

        function appendMessage(role, content) {
            const p = document.createElement('p');
            p.className = role;
            p.textContent = `${role === 'user' ? 'You' : 'Pegasus'}: ${content}`;
            chatbox.appendChild(p);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        userinput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendbtn.click();
        });
    </script>
</body>
</html>
`;

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === 'GET' && path === '/') {
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (req.method === 'POST' && path === '/api/chat') {
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

  if (req.method === 'POST' && path === '/api/clear') {
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
