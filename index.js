const fs = require('fs');

function convertWhatsAppChatToJSON(inputFile, outputFile) {
    // Read the input file
    const chatContent = fs.readFileSync(inputFile, 'utf-8');

    // Split the content into lines
    const lines = chatContent.split('\n');

    let currentSpeaker = '';
    let currentInput = [];
    let currentOutput = [];
    let dataset = [];

    lines.forEach(line => {
        // Check if the line starts with a date (indicating a new message)
        if (/^\d{2}\/\d{2}\/\d{2},\s\d{1,2}:\d{2}\s[ap]m\s-\s/.test(line)) {
            const [, speaker, message] = line.match(/^.*?-\s(.*?):\s(.*)$/);

            // If the speaker changes, process the previous conversation
            if (speaker !== currentSpeaker && currentInput.length > 0) {
                dataset.push({
                    instruction: "You are Hriday Ranka",
                    input: currentInput.join('\n'),
                    output: currentOutput.join('\n')
                });
                currentInput = [];
                currentOutput = [];
            }

            currentSpeaker = speaker;

            // Add the message to the appropriate array
            if (speaker === 'Kartikeya Mishra') {
                currentInput.push(message);
            } else if (speaker === 'Hriday Ranka') {
                currentOutput.push(message);
            }
        } else if (line.trim() !== '') {
            // If it's a continuation of a previous message
            if (currentSpeaker === 'Kartikeya Mishra') {
                currentInput[currentInput.length - 1] += '\n' + line;
            } else if (currentSpeaker === 'Hriday Ranka') {
                currentOutput[currentOutput.length - 1] += '\n' + line;
            }
        }
    });

    // Process any remaining conversation
    if (currentInput.length > 0) {
        dataset.push({
            instruction: "You are Hriday Ranka",
            input: currentInput.join('\n'),
            output: currentOutput.join('\n')
        });
    }

    // Write the dataset to the output file
    fs.writeFileSync(outputFile, JSON.stringify(dataset, null, 2));

    console.log(`Conversion complete. Output written to ${outputFile}`);
}

// Usage
const inputFile = 'whatsapp-chat-kartikeya.txt';
const outputFile = 'chat_dataset.json';
convertWhatsAppChatToJSON(inputFile, outputFile);