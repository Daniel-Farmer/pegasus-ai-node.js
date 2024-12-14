document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalDisplay = document.getElementById('terminal-display');
    const newTerminalButton = document.getElementById('new-terminal-button');
    const instanceSelect = document.getElementById('instance-select');

    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value;
            const instance = instanceSelect.value;
            executeCommand(command, instance);
            terminalInput.value = '';
        }
    });

    newTerminalButton.addEventListener('click', () => {
        // Placeholder for creating a new terminal
        alert('New terminal functionality to be implemented');
    });

    function executeCommand(command, instance) {
        // Placeholder for executing commands
        // In a real implementation, this would send the command to the server
        const output = `Executing "${command}" on ${instance}...`;
        displayOutput(output);
    }

    function displayOutput(output) {
        const outputElement = document.createElement('div');
        outputElement.textContent = output;
        terminalDisplay.appendChild(outputElement);
        terminalDisplay.scrollTop = terminalDisplay.scrollHeight;
    }
});