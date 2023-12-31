const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// using Middleware
app.use(cors());
app.use(express.json());

// *************************** Database connection and operation Start **********************

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ea4znei.mongodb.net/?retryWrites=true&w=majority`;

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
		await client.connect();

		// Database Operations Start

		const database = client.db("MTaskDB");
		const taskCollection = database.collection("UserTask");

		//create new task
		app.post("/task", async (req, res) => {
			const newTask = req.body;
			const result = await taskCollection.insertOne(newTask);
			res.send(result);
		});

		//get specific user task
		app.get("/task", async (req, res) => {
			let query = {};
			if (req.query?.email) {
				query = {
					email: req.query.email,
				};
			}
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
		});

        //delete a task
        app.delete("/task/:id",async(req,res) => {
            const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await taskCollection.deleteOne(query);
			res.send(result);
        })

		// Database Operations End

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
	}
}
run().catch(console.dir);

// *************************** Database connection and operation End **********************

//default setting for start the server
app.get("/", (req, res) => {
	res.send("MTaks server is Running.");
});
app.listen(port, () => {
	console.log(`Elijah server is running on port: ${port}`);
});
