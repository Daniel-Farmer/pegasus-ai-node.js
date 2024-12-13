const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';

app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
      model: 'pegasus',
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