// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//  console.log("Gemini API Key:", process.env.GEMINI_API_KEY);
// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const model = genAI.getGenerativeModel({
//       model: "gemini-pro", // ✅ change here
//     });

//     const result = await model.generateContent(message);
//     const response = await result.response;

//     res.json({
//       reply: response.text(),
//     });

//   } catch (error) {
//     console.error("FULL ERROR:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(5000, () => {
//   console.log("Gemini server running on port 5000");
// });

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash-lite",
//     });

//     // ✅ Retry up to 3 times with delay
//     let lastError;
//     for (let attempt = 1; attempt <= 3; attempt++) {
//       try {
//         const result = await model.generateContent(message);
//         const response = result.response;
//         return res.json({ reply: response.text() });
//       } catch (err) {
//         lastError = err;
//         if (err.status === 429) {
//           console.log(`Rate limited. Attempt ${attempt}/3. Waiting 5s...`);
//           await new Promise(r => setTimeout(r, 5000 * attempt)); // 5s, 10s, 15s
//         } else {
//           throw err; // non-quota error, don't retry
//         }
//       }
//     }

//     throw lastError; // all retries failed

//   } catch (error) {
//     console.error("FULL ERROR:", error);

//     // ✅ Send friendly message to frontend
//     if (error.status === 429) {
//       return res.status(429).json({
//         error: "API quota exceeded. Please wait a minute and try again."
//       });
//     }

//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(5000, () => {
//   console.log("Gemini server running on port 5000");
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(
  "Gemini API Key:",
  process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌",
);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required." });
    }

    // ✅ Fixed: lowercase with hyphens
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.status === 429) {
      return res.status(429).json({
        error: "Quota exceeded. Please wait or create a new API key.",
      });
    }

    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Gemini server running on port 5000 ✅");
});
