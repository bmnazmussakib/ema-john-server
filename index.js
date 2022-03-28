const app = require('./app');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser')
const PORT = 8080;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pkxrx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("product");
    const orderCollection = client.db("emaJohnStore").collection("order");

    console.log("Database Connected Successfully");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertMany(product)
            .then(result => {
                console.log(result);
                console.log("Product added successfully");
            });

    })


    app.get('/products', (req, res) => {
        productCollection.find({})
            .limit(20)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/products/:key', (req, res) => {
        productCollection.find({key: req.params.key})
            .limit(20)
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/getProductsByKeys', (req, res) => {
        const productKeys = req.body;

        productCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
            res.send(documents);
        })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result);
                console.log("Order added successfully");
            });

    })


});








app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})