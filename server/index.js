const express = require('express');
const massive = require('massive');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mm = require('music-metadata');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

const { SERVER_PORT, CONNECTION_STRING, PROJECT_ID, BUCKET_NAME } = process.env;
process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-auth-aphasia.json';

const app = express();
app.use( express.static( `${__dirname}/../build` ) );
app.use(bodyParser.json());
app.use(fileUpload());
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    app.listen(SERVER_PORT, () => console.log(`We are live at port ${SERVER_PORT}`));
})

const storage = new Storage({
    keyFileName: path.join(__dirname, '../google-auth-aphasia.json'),
    projectId: PROJECT_ID,
});

const storeFile = (req, res, next) => {
    const { file } = req.files;

    if (!file.name.endsWith('wav')) {
        res.status(500).send('must be a wav file');
    }
    const fileName = `${file.name.replace(/ *\([^)]*\) */g, '').replace(/\s/g, '').split('.')[0]}`
    const location = path.join(__dirname, `../files/${fileName}.wav`);

    fs.writeFile(location, file.data, (err) => {
        if (err) res.status(500).send('error writting file');
        mm.parseFile(location, {native: true}).then(async metadata => {
                req.file = {
                    name: file.name,
                    mimetype: file.mimetype,
                    location,
                    fileName,
                    channels: metadata.format.numberOfChannels,
                    sampleRate: metadata.format.sampleRate,
                };
                next();
        }).catch(err => {
            res.status(500).send(err);
        })
    });

}


const uploadFile = async (req, res, next) => {
    try {

        if (!req.file) {
            return next();
        }
        
        const { fileName, location } = req.file;
        
        const options = {
            gzip: false,
            destination: fileName,
            metadata: {
                contentType: req.file.mimetype,
            },
        };
        
        await storage.bucket(BUCKET_NAME).upload(location, options);
        // await file.makePublic();
        req.file.gcsUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
        next();
    } catch (e) {
        res.status(500).send(e);
    }
};

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

app.put('/api/submit', storeFile, uploadFile, async (req, res) => {
    try {
        const { file } = req;
        if (!file && !file.gcsUrl) {
            res.status(500).send('Unable to upload');
        }
        const speech = require('@google-cloud/speech');
        const client = new speech.SpeechClient();
        
        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            uri: `gs://${BUCKET_NAME}/${file.fileName}`
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: file.sampleRate,
            languageCode: 'en-US',
        };

        const request = {
            audio: audio,
            config: config,
        };
    
        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        const [operation] = await client.longRunningRecognize(request);
        // Get a Promise representation of the final result of the job
        const [response] = await operation.promise();
        const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
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