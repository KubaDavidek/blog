const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Připojení k MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/blog")
  .then(() => console.log("✅ Připojeno k MongoDB"))
  .catch(err => console.error("❌ Chyba připojení:", err));

// Definice modelu podle struktury tvého JSONu
const Post = mongoose.model("Post", new mongoose.Schema({
  id: String,
  headline: String,
  content: String,
  category: String,
  createdDate: String,
  url: String
}));

// Endpoint pro získání článků
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Chyba při čtení dat" });
  }
});

// Endpoint pro vložení nového článku (nepovinné)
app.post("/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.json({ message: "Příspěvek uložen" });
  } catch (err) {
    res.status(500).json({ error: "Chyba při ukládání" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server běží na http://localhost:${PORT}`));
