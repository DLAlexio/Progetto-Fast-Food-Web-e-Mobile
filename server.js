const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend statico dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB setup
const uri = "mongodb+srv://dbUser:DLAlexio28@fastfood.y7f3kil.mongodb.net/?appName=Fastfood";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let menuCollection;

async function connectDB() {
  await client.connect();
  const db = client.db("Fastfood");
  menuCollection = db.collection("menu");
  console.log("Connesso a MongoDB!");
}
connectDB().catch(console.dir);

// Rotte API
app.get('/menu', async (req, res) => {
  if (!menuCollection) return res.status(500).send("DB non pronto");
  const menu = await menuCollection.find().toArray();
  res.json(menu);
});

app.post('/menu', async (req, res) => {
  if (!menuCollection) return res.status(500).send("DB non pronto");
  const nuovoPiatto = req.body;
  await menuCollection.insertOne(nuovoPiatto);
  res.json({ status: 'success', piatto: nuovoPiatto });
});

// Route root per test
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvio server
app.listen(3000, () => console.log('Server avviato su http://localhost:3000'));