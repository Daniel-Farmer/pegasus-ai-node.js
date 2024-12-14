export function initSettings() {
    const settingsLink = document.querySelector('a[href="#settings"]');
    const settingsPopup = document.getElementById('settings-popup');
    const closeSettings = document.getElementById('close-settings');
    const settingsForm = document.getElementById('settings-form');

    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        settingsPopup.style.display = 'block';
    });

    closeSettings.addEventListener('click', () => {
        settingsPopup.style.display = 'none';
    });

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const serverName = document.getElementById('server-name').value;
        const ollamaUrl = document.getElementById('ollama-url').value;
        
        localStorage.setItem('serverName', serverName);
        localStorage.setItem('ollamaUrl', ollamaUrl);

        console.log('Settings saved:', { serverName, ollamaUrl });

        settingsPopup.style.display = 'none';
    });

    const savedServerName = localStorage.getItem('serverName');
    const savedOllamaUrl = localStorage.getItem('ollamaUrl');
    if (savedServerName) document.getElementById('server-name').value = savedServerName;
    if (savedOllamaUrl) document.getElementById('ollama-url').value = savedOllamaUrl;
}