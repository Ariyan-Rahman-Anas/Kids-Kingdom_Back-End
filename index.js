const express = require("express")
const cors = require("cors")
const port = process.env.PORT || 5001
const app = express()
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

//middleware
app.use(cors())
app.use(express.json())


// copied from mongodb starts from here
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toh0ohl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //db collections should be in here
    const productsCollection = client.db("Kids-Kingdom").collection("Products");


    //getting all bookings for the client side
    app.get("/products", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query?.email };
      }
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //storing all products
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// copied from mongodb ends here

//server testing
app.get("/", (req, res) => {
    res.send("Kids-Kingdom Server is running...")
})

app.listen(port, () => {
    console.log(`The Kids-Kingdom server is running on port: ${port}`)
})