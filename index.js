const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const uri = process.env.DB_URL;
const secret = process.env.SECRET;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const taskDatabase = client.db("taskDB");
    const taskCollection = taskDatabase.collection("task_collection");

    app.post("/create-task", async (req, res) => {
      const user = req.body;
      const result = await taskCollection.insertOne(user);
      res.send(result);
    });
    app.get("/task", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });
     app.patch("/task/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    });
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    
    console.log("successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/about", (req, res) => {
  res.send("this is about");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

