function getOllamaUrl() {
    return localStorage.getItem('ollamaUrl') || 'http://localhost:11434';
}

export async function testApiConnection() {
    try {
        const response = await fetch(getOllamaUrl() + '/api/version');
        if (response.ok) {
            console.log('API connection successful');
            document.getElementById('api-status').textContent = 'API: Online';
        } else {
            throw new Error('API connection failed');
        }
    } catch (error) {
        console.error('API connection error:', error);
        document.getElementById('api-status').textContent = 'API: Offline';
    }
}

export async function sendMessage(message) {
    const ollamaUrl = getOllamaUrl();
    try {
        const response = await fetch(ollamaUrl + '/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: localStorage.getItem('currentModel') || 'llama2',
                prompt: message,
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export function setCurrentModel(model) {
    localStorage.setItem('currentModel', model);
}