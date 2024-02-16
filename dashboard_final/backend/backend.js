const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.get('/data', async (req, res) => {
    const uri = "mongodb+srv://Rachit:6Q1dLzyyG8RnZWW2@cluster0.olun1qo.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('Crowd_source');
        const collection = database.collection('patterns');
        const data = await collection.find().toArray();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error connecting to database');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});