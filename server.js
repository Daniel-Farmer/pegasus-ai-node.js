const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';

app.post('/api/set-ollama-url', (req, res) => {
  const { url } = req.body;
  OLLAMA_API_URL = url;
  res.json({ success: true, message: 'Ollama API URL updated' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, model } = req.body;
    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
      model: model || 'llama2',
      prompt: message
    });
    res.json({ response: response.data.response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
