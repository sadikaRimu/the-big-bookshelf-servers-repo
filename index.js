const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3eoxza1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('assignment12db').collection('users');
        const booksCategoryCollection = client.db('assignment12db').collection('booksCategory');
        const booksCollection = client.db('assignment12db').collection('books');


        app.get('/users', async (req, res) => {
            const query = {};
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'Admin' });
        });
        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            // const filter = { _id: ObjectId(id) }
            // const options = { upsert: true };
            // const updatedDoc = {
            //     $set: {
            //         role: 'admin'
            //     }
            // }
            // const result = await usersCollection.updateOne(filter, updatedDoc, options);
            // res.send(result);
            // const filter = { _id: ObjectId(id) };
            // const options = { upsert: true };
            // const updatedDoc = {
            //     $set: {
            //         role: 'Admin'
            //     }
            // }
            // const result = await usersCollection.updatedOne(filter, updatedDoc, options);
            // res.send(result);
        });
        app.get('/booksCategory', async (req, res) => {
            const query = {};
            const result = await booksCategoryCollection.find(query).project({ name: 1 }).toArray();
            res.send(result);
        });
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await booksCollection.insertOne(book);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('the big bookshelf server is running');
});
app.listen(port, () => {
    console.log(`the big bookshelf server running on port, ${port}`);
});