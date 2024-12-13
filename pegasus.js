import fetch from 'node-fetch';

class Pegasus {
  constructor(ollamaApiUrl) {
    this.conversation_history = [];
    this.ollamaApiUrl = ollamaApiUrl;
  }

  async generate_response(user_input) {
    this.conversation_history.push({ role: "user", content: user_input });

    try {
      const response = await fetch(`${this.ollamaApiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama2",
          messages: this.conversation_history,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistant_response = data.message.content;
      this.conversation_history.push({ role: "assistant", content: assistant_response });

      return assistant_response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I apologize, but I encountered an error while processing your request.";
    }
  }

  clear_conversation_history() {
    this.conversation_history = [];
  }
}

export default Pegasus;