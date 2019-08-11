import { makeMessage } from '../shared/message';
import express = require('express');
import * as path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/api/message', (req, res) => {
    res.status(200).send({
        message: makeMessage()
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
