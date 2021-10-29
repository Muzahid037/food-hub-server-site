const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0x5od.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("foodhub");
        const foodCollection = database.collection("food");
        const orderCollection = database.collection("orders");

        // find service get api 
        app.get('/services', async (req, res) => {

            const cursor = foodCollection.find({});
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const services = await cursor.toArray();
            res.send(services);
        })


        // get one specific service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("id: ", id);
            const query = { _id: ObjectId(id) };
            const service = await foodCollection.findOne(query);
            res.send(service)
        })

        // add service post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log("hitting post", service);

            const result = await foodCollection.insertOne(service);
            //console.log(result);
            res.json(result);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })



        // find orders get api 
        app.get('/orders', async (req, res) => {

            const cursor = orderCollection.find({});
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // get one users order 
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            // console.log("email: ", email);
            const query = { email: email };

            const cursor = orderCollection.find(query);
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                // console.log("No documents found!");
            }
            const orders = await cursor.toArray();

            res.send(orders)
        })


        // add oder post api 
        app.post('/orders', async (req, res) => {
            const order = req.body;
            // console.log("hitting post", service);

            const result = await orderCollection.insertOne(order);
            //console.log(result);
            res.json(result);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        // delete an order api 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("hitting delete ", ObjectId(id));

            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            // if (result.deletedCount === 1) {
            //     console.log("Successfully deleted one document.");
            // } else {
            //     console.log("No documents matched the query. Deleted 0 documents.");
            // }
            res.json(result);
        })



           // update/put api 
           app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Hitting user', id);
            const updatedOrders = req.body;
            console.log('Updated user', updatedOrders);
            const filter = { _id: ObjectId(id) };
            // // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    status: updatedOrders.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })




        /*
        
              // create a document to insert
              const doc = {
                name: "Smoky bbq beef burger",
                img:"https://image.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg",
                des: "A hamburger is a food, typically considered a sandwich, consisting of one or more cooked patties—usually ground meat, typically beef—placed inside a sliced bread roll or bun."
              }
              const result = await foodCollection.insertOne(doc);
              console.log(`A document was inserted with the _id: ${result.insertedId}`);
              */
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running food-hub!')
})

app.listen(port, () => {
    // console.log(`food-hub listening at http://localhost:${port}`)
})