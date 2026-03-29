// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log(
//   "Gemini API Key:",
//   process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌",
// );

// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message || message.trim() === "") {
//       return res.status(400).json({ error: "Message is required." });
//     }

//     // ✅ Fixed: lowercase with hyphens
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const result = await model.generateContent(message);
//     const reply = result.response.text();

//     res.json({ reply });
//   } catch (error) {
//     console.error("FULL ERROR:", error);

//     if (error.status === 429) {
//       return res.status(429).json({
//         error: "Quota exceeded. Please wait or create a new API key.",
//       });
//     }

//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(5000, () => {
//   console.log("Gemini server running on port 5000 ✅");
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// ✅ CORS (allow your frontend)
app.use(
  cors({
    origin: "*", // later change to your frontend URL
  }),
);

app.use(express.json());

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Vercel backend working 🚀" });
});

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.status === 429) {
      return res.status(429).json({
        error: "Quota exceeded. Please wait or use a new API key.",
      });
    }

    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

// ❌ REMOVE app.listen()
// ✅ Export for Vercel
export default serverless(app);
