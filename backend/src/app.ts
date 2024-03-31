import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { expressjwt as jwt } from 'express-jwt';
import process from 'process';
import csvParserHandler from 'csv-parser'
import jwtMain from 'jsonwebtoken';
import expressFileUploadMiddleware, { UploadedFile } from 'express-fileupload';
import { Readable } from 'stream';
import { dynamicCsvModel } from './models';

dotenv.config();

const app = express();

const jwtSecret = process.env.JWT_SECRET || 'testing';
const [adminLogin, adminPassword] = [process.env.AUTH_USER, process.env.AUTH_PASS];

app.use(express.json());
app.use(cors());
app.use(jwt({
    secret: jwtSecret,
    algorithms: ['HS256']
}).unless({
    path: [
        '/auth'
    ]
}));


app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    if (username === adminLogin && password === adminPassword) {
        res.status(200).json({
            token: jwtMain.sign({ username }, jwtSecret, { expiresIn: '1h' })
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
})

app.get('/csv', async (req, res) => {
    const collections = await dynamicCsvModel('csv').find({}, { _id: 0, __v: 0 });

    if (collections.length === 0) {
        res.status(404).json({ message: 'No records found' });
        return;
    }

    res.status(200).json(collections.map((collection) => {
        return collection.toObject({ versionKey: false });
    }));
});

app.post('/csv', expressFileUploadMiddleware(), async (req, res) => {
    const file = Array.isArray(req.files?.file) ? req.files.file[0] : req.files?.file;

    if (file === undefined) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    if (file.mimetype !== 'text/csv') {
        res.status(400).json({ message: 'Invalid file type' });
        return;
    }

    const rows: any[] = [];
    const reader = new Readable();
    reader.push(file.data);
    reader.push(null);

    try {
        reader
            .pipe(csvParserHandler())
            .on('data', (row) => {
                Object.keys(row).forEach(key => {
                    if (row[key] === '') {
                        delete row[key];
                    }
                });

                rows.push(row);
            })
            .on('end', () => {
                dynamicCsvModel('csv').deleteMany({}).then(() => {
                    dynamicCsvModel('csv').insertMany(rows).then(() => {
                        res.status(200).json({ message: 'Success', rowsInserted: rows.length });
                    }).catch((err) => {
                        res.status(500).json({ message: 'Error when inserting records.' });
                    });
                });

            });
    } catch (err) {
        res.status(500).json({ message: 'Error parsing CSV' });
    }
});

export default app;