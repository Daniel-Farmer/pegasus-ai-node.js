import express from 'express';
import dotenv from 'dotenv';
import Pegasus from './pegasus.js';

dotenv.config();

const app = express();
app.use(express.json());

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const pegasus = new Pegasus(OLLAMA_API_URL);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pegasus AI API' });
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await pegasus.generate_response(message);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.post('/api/clear', (req, res) => {
  pegasus.clear_conversation_history();
  res.json({ message: 'Conversation history cleared' });
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
