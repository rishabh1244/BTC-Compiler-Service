import express from "express";
import compileRouter from "./problems/route.js";

import cors from "cors";

const app = express();
const PORT = 3001;
app.use(cors({
    origin: "http://localhost:3000",   // your nextjs url
    credentials: true
}));


app.use(express.json()); // IMPORTANT for req.body JSON

app.get("/", (req, res) => {
    res.send("Hello World! This is an Express server.");
});

// ✅ mount router
app.use("/api", compileRouter);

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// npx tsx --env-file=.env.local server.ts

