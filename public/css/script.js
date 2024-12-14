// Add these lines at the beginning of the file
const settingsIcon = document.querySelector('.fas.fa-cog');
const settingsPopup = document.getElementById('settingsPopup');
const closePopup = document.getElementById('closePopup');
const saveSettings = document.getElementById('saveSettings');
const aiUrl = document.getElementById('aiUrl');
const aiPort = document.getElementById('aiPort');

// Add this function to handle opening the popup
function openSettingsPopup() {
  settingsPopup.style.display = 'block';
  // Load saved settings if available
  aiUrl.value = localStorage.getItem('aiUrl') || '';
  aiPort.value = localStorage.getItem('aiPort') || '';
}

// Add this function to handle closing the popup
function closeSettingsPopup() {
  settingsPopup.style.display = 'none';
}

// Add this function to handle saving the settings
function saveAISettings() {
  localStorage.setItem('aiUrl', aiUrl.value);
  localStorage.setItem('aiPort', aiPort.value);
  closeSettingsPopup();
}

// Add these event listeners
settingsIcon.addEventListener('click', openSettingsPopup);
closePopup.addEventListener('click', closeSettingsPopup);
saveSettings.addEventListener('click', saveAISettings);

// Modify the existing sendbtn.onclick function to use the saved settings
sendbtn.onclick = async () => {
    const message = userinput.value;
    if (message) {
        appendMessage('user', message);
        userinput.value = '';
        try {
            const savedUrl = localStorage.getItem('aiUrl');
            const savedPort = localStorage.getItem('aiPort');
            const apiUrl = savedUrl && savedPort ? `${savedUrl}:${savedPort}/api/chat` : '/api/chat';
            
            const response = await fetch(apiUrl, {
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