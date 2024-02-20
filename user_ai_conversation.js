const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/generate-doc', async(req, res) => {
    try {
        const userInput = req.body;

        // Use OpenAI API to get a GPT response
        const gptResponse = await getGptResponse(userInput.userMessage);

        // Read the Word document template
        const templateContent = fs.readFileSync('path/to/template.docx', 'binary');
        const templateBuffer = Buffer.from(templateContent, 'binary');

        // Create a new Docxtemplater instance
        const doc = new Docxtemplater();
        doc.loadZip(templateBuffer);

        // Replace placeholders with user input and GPT response
        doc.setData({
            userName: userInput.userName,
            gptResponse: gptResponse,
        });

        // Render the document
        doc.render();

        // Generate response as a downloadable Word document
        const responseBuffer = doc.getZip().generate({ type: 'nodebuffer' });
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.set('Content-Disposition', 'attachment; filename=generated-doc.docx');
        res.send(responseBuffer);
    } catch (error) {
        console.error('Error generating document:', error);
        res.status(500).send('Error generating document');
    }
});

async function getGptResponse(userMessage) {

    const apiKey = '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';

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userMessage },
                ],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error making OpenAI API call:', error);
        throw new Error('Error getting GPT response');
    }
}

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
