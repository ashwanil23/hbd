import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// Example storage (temporary)
let wishes = [];

// Get all wishes
app.get("/wishes", (req, res) => {
    res.json(wishes);
});

// Add a new wish
app.post("/wishes", (req, res) => {
    const wish = req.body;
    wishes.push(wish);
    res.status(201).json({ message: "Wish saved successfully!" });
});

//app.listen(5000, () => console.log("✅ Server running on port 5000"));



app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
