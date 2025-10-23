const mongoose = require("mongoose");
const fs = require("fs");
const readline = require("readline");

const Post = mongoose.model("Post", new mongoose.Schema({
  headline: String,
  content: String,
  category: String,
  createdDate: String,
  url: String
}));

mongoose.connect("mongodb://127.0.0.1:27017/blog")
  .then(async () => {
    console.log("Připojeno");

    const fileStream = fs.createReadStream("data.jsonl");
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let batch = [];
    for await (const line of rl) {
      if (!line.trim()) continue;
      const obj = JSON.parse(line);
      batch.push({
        headline: obj.headline,
        content: obj.content,
        category: obj.category,
        createdDate: obj.createdDate,
        url: obj.url
      });
      if (batch.length >= 1000) {
        await Post.insertMany(batch);
        console.log(`Uloženo ${batch.length} záznamů`);
        batch = [];
      }
    }

    if (batch.length > 0) await Post.insertMany(batch);
    console.log("✅ Hotovo");
    process.exit(0);
  });

