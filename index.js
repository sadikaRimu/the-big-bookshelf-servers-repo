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
        const bookingCollection = client.db('assignment12db').collection('bookingItems');


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
        //social login
        app.get('/users/socialUser/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            if (user) {
                res.send(true);
            }
            else {
                res.send(false);
            }

        });
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'Buyer' });
        });
        app.get('/users/verified/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isVerified: user?.status === 'Verified' });
        });
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'Seller' });
        });
        app.get('/users/seller', async (req, res) => {
            const query = { role: 'Seller' };
            const user = await usersCollection.find(query).toArray();
            // console.log(user);
            //res.send({ isSeller: user?.role === 'Seller' });
            res.send(user);
        });
        app.get('/users/buyer', async (req, res) => {
            const query = { role: 'Buyer' };
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        });
        app.put('/users/seller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'Verified'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        app.put('/users/makeAdmin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const userRole = req.body;
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: userRole.role
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, option);
            console.log(result);
            res.send(result);
        });
        app.get('/booksCategory', async (req, res) => {
            const query = {};
            const result = await booksCategoryCollection.find(query).project({ name: 1 }).toArray();
            res.send(result);
        });
        //get method for my products
        app.get('/books', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const books = await booksCollection.find(query).toArray();
            console.log(books);
            res.send(books);
        });
        // get method for addvertise product
        app.get('/books/addvertise', async (req, res) => {
            // const email = req.query.email;
            const query = { advertise: 'Advertised' };
            const books = await booksCollection.find(query).toArray();
            // console.log(books);
            res.send(books);
        });
        app.get('/books/:name', async (req, res) => {
            const name = req.params.name;
            const query = { booksCategory: name };
            const books = await booksCollection.find(query).toArray();
            const query2 = books.map(book => {
                const bookedIem = { available: book.status !== 'Booked' }
                return bookedIem;
            });
            //const books2 = await booksCollection.find(query2).toArray();
            console.log(query);
            res.send(books);
        });
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await booksCollection.insertOne(book);
            res.send(result);
        });
        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    advertise: 'Advertised'
                }
            }
            const result = await booksCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        //updated book status
        app.put('/books/status/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'Booked'
                }
            }
            const result = await booksCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });
        app.get('/books/:booksCategory', async (req, res) => {
            const booksCategory = req.params.booksCategory
            const query = { booksCategory };
            const item = await booksCollection.findOne(query);
            res.send({ isBooked: item?.status === 'Booked' });

        })
        app.get('/wishList/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const item = await bookingCollection.find(query).toArray();
            res.send(item);

        });
        app.delete('/wishList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
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