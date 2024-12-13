const chatbox = document.getElementById('chatbox');
const userinput = document.getElementById('userinput');
const sendbtn = document.getElementById('sendbtn');

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
