document.addEventListener('DOMContentLoaded', () => {
    console.log('FlowAI Popup Loaded');

    const generateButton = document.getElementById('generate-flow');
    const flowList = document.getElementById('flow-list');

    generateButton.addEventListener('click', () => {
        const promptInput = document.getElementById('prompt-input').value;
        // Here you would call your AI function to generate the flow
        const newFlow = document.createElement('li');
        newFlow.textContent = `Flow generated for: ${promptInput}`;
        flowList.appendChild(newFlow);
    });
});
