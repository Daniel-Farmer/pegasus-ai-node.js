function getOllamaUrl() {
    return localStorage.getItem('ollamaUrl') || 'http://localhost:11434'; // Default URL
}

export async function sendMessage(message) {
    const ollamaUrl = getOllamaUrl();
    // Use ollamaUrl in your API calls
    // ... (implementation details not provided in the previous context)
}

export async function testApiConnection() {
    // ... (implementation details not provided in the previous context)
}

export function setCurrentModel(model) {
    // ... (implementation details not provided in the previous context)
}