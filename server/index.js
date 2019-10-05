const express = require('express');
const massive = require('massive');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const { SERVER_PORT, CONNECTION_STRING } = process.env;
process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-auth-aphasia.json';

const app = express();
// app.use( express.static( `${__dirname}/../build` ) );
app.use(bodyParser.json());
app.use(fileUpload());
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    app.listen(SERVER_PORT, () => console.log(`We are live at port ${SERVER_PORT}`));
})

app.put('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = req.app.get('db');
        const userData = await db.users.findOne({
            'username =': username
        });
        if (!userData) {
            return res.status(401).send('Invalid Username')
        }
        const compare = bcrypt.compareSync(password, userData.password);
        if (!compare) {
            return res.status(401).send('Incorrect Password')
        }
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
    }
});

app.put('/api/submit', async (req, res) => {
  console.log('submitting')
    // Imports the Google Cloud client library
    try {
        const speech = require('@google-cloud/speech');
    
        // Creates a client
        const client = new speech.SpeechClient();
    
        // Reads a local audio file and converts it to base64
        const audioBytes = req.files.file.data.toString('base64');
    
        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            content: audioBytes,
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };
    
        // Detects speech in the audio file
        const [operation] = await client.longRunningRecognize(request);

        const [response] = await operation.promise();
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
            console.log(transcription);
        res.status(200).send(transcription);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

app.get('/api', (req, res) => {
    res.status(200).send({
        message: 'success'
    });
});