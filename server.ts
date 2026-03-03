import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("neurolearn.db");

// Initialize DB tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'student',
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges TEXT DEFAULT '[]'
  );
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    modules TEXT,
    difficulty TEXT
  );
  CREATE TABLE IF NOT EXISTS career_assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    primary_domain TEXT,
    secondary_domain TEXT,
    compatibility_score INTEGER,
    recommended_courses TEXT,
    roadmap TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data
try {
  const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare("INSERT INTO users (username, email, password, role, xp, level) VALUES (?, ?, ?, ?, ?, ?)");
    insertUser.run("Srini", "srini@gmail.com", "srini@44", "student", 1250, 5);
    insertUser.run("Demo Admin", "admin@neurolearn.ai", "admin123", "admin", 9999, 99);
    console.log("Database seeded with initial users.");
  } else {
    // Ensure Srini exists even if DB was already seeded
    const srini = db.prepare("SELECT * FROM users WHERE email = ?").get("srini@gmail.com");
    if (!srini) {
      const insertUser = db.prepare("INSERT INTO users (username, email, password, role, xp, level) VALUES (?, ?, ?, ?, ?, ?)");
      insertUser.run("Srini", "srini@gmail.com", "srini@44", "student", 1250, 5);
      console.log("Seeded missing user: Srini");
    }
  }
} catch (error) {
  console.error("Seeding error:", error);
}

const courseCount = db.prepare("SELECT count(*) as count FROM courses").get() as { count: number };
if (courseCount.count === 0) {
  const courses = [
    {
      title: "Quantum Computing Basics",
      description: "Introduction to qubits, superposition, and entanglement.",
      modules: JSON.stringify(["Qubits 101", "Superposition", "Entanglement", "Quantum Gates"]),
      difficulty: "Hard"
    },
    {
      title: "Neural Networks & Deep Learning",
      description: "Build your first neural network from scratch.",
      modules: JSON.stringify(["Perceptrons", "Backpropagation", "CNNs", "RNNs"]),
      difficulty: "Medium"
    },
    {
      title: "Space Exploration Engineering",
      description: "Rocket propulsion and orbital mechanics.",
      modules: JSON.stringify(["Rocket Equation", "Orbital Mechanics", "Life Support Systems"]),
      difficulty: "Hard"
    }
  ];
  const insert = db.prepare("INSERT INTO courses (title, description, modules, difficulty) VALUES (@title, @description, @modules, @difficulty)");
  courses.forEach(c => insert.run(c));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { email, password, role } = req.body;
    console.log(`Login attempt for: ${email} with role: ${role}`);
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      
      if (user) {
        console.log(`User found: ${user.username}, Role: ${user.role}`);
        if (user.password === password) {
             // Simple role check (in a real app, role would be in DB)
            if (role && user.role !== role) {
               console.log(`Role mismatch. Expected ${role}, got ${user.role}`);
               // For now, we allow it but maybe we should warn? 
               // Or strictly enforce:
               // if (user.role !== role) return res.status(403).json({ error: "Role mismatch" });
            }
            console.log("Login successful");
            res.json(user);
        } else {
            console.log("Invalid password");
            res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        console.log("User not found");
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (e) {
      console.error("Login error:", e);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/user", (req, res) => {
    try {
      const user = db.prepare("SELECT * FROM users WHERE username = ?").get("DemoUser");
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/courses", (req, res) => {
    try {
      const courses = db.prepare("SELECT * FROM courses").all();
      res.json(courses);
    } catch (e) {
      res.status(500).json({ error: "Database error" });
    }
  });

  app.post("/api/localize", async (req, res) => {
    try {
      const { text, targetLang, simplify } = req.body;
      
      let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey || apiKey.includes("PLACEHOLDER")) {
        return res.status(500).json({ error: "API Key not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });

      let prompt = `Translate the following text to ${targetLang}.`;
      if (simplify) {
        prompt += " Also, simplify the content to make it easily understandable for a rural audience or beginners, avoiding complex jargon.";
      }
      prompt += `\n\nText: "${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ]
      });

      res.json({ translatedText: response.text });
    } catch (error: any) {
      console.error("Localization Error:", error);
      res.status(500).json({ error: "Localization failed", details: error.message });
    }
  });

  // Career Guidance APIs
  app.post("/api/career/stage1/questions", async (req, res) => {
    try {
      const { selected_domains } = req.body;
      let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API Key not configured" });

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Generate 5 joyful, scenario-based questions to assess interest in these domains: ${selected_domains.join(", ")}.
        Questions should be engaging, not exam-like.
        Return ONLY a JSON array of objects with keys: "id", "question", "options" (array of strings), "domain_mapping" (which domain each option maps to).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      res.json(JSON.parse(response.text));
    } catch (e: any) {
      console.error("Stage 1 Error:", e);
      res.status(500).json({ error: "Failed to generate questions" });
    }
  });

  app.post("/api/career/stage1/evaluate", async (req, res) => {
    try {
      const { answers } = req.body; // answers: [{ question_id, selected_option, domain_mapping }]
      // Simple logic: Count domain mappings
      const scores: Record<string, number> = {};
      answers.forEach((a: any) => {
        const domain = a.domain_mapping;
        scores[domain] = (scores[domain] || 0) + 1;
      });
      
      const sortedDomains = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const topDomains = sortedDomains.slice(0, 2).map(d => d[0]);
      
      res.json({ 
        top_domains: topDomains, 
        interest_score: scores,
        message: "You show strong analytical thinking and pattern recognition skills." // Static for now, could be dynamic
      });
    } catch (e) {
      res.status(500).json({ error: "Evaluation failed" });
    }
  });

  app.post("/api/career/stage2/questions", async (req, res) => {
    try {
      const { top_domains } = req.body;
      let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API Key not configured" });

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Generate 3 aptitude and logical reasoning questions relevant to these domains: ${top_domains.join(", ")}.
        Return ONLY a JSON array of objects with keys: "id", "question", "options", "correct_option".
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      res.json(JSON.parse(response.text));
    } catch (e: any) {
      console.error("Stage 2 Error:", e);
      res.status(500).json({ error: "Failed to generate aptitude questions" });
    }
  });

  app.post("/api/career/stage2/evaluate", async (req, res) => {
    try {
      const { answers, stage1_results, user_id } = req.body;
      let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API Key not configured" });

      // Calculate aptitude score
      let correct = 0;
      answers.forEach((a: any) => {
        if (a.selected_option === a.correct_option) correct++;
      });
      const aptitudeScore = (correct / answers.length) * 100;

      const ai = new GoogleGenAI({ apiKey });
      
      // Fetch available courses to map
      const allCourses = db.prepare("SELECT * FROM courses").all();
      
      const prompt = `
        User Interest: ${JSON.stringify(stage1_results)}
        Aptitude Score: ${aptitudeScore}
        Available Courses: ${JSON.stringify(allCourses)}
        
        Generate a career roadmap JSON with:
        - primary_domain
        - secondary_domain
        - compatibility_score (0-100)
        - recommended_courses (filter from Available Courses)
        - roadmap (foundation, intermediate, advanced, placement_prep arrays)
        - skill_gap_analysis (array of strings)
        - estimated_time_to_job_ready
        
        Return ONLY JSON.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);

      // Store in DB
      if (user_id) {
        const insert = db.prepare(`
          INSERT INTO career_assessments (user_id, primary_domain, secondary_domain, compatibility_score, recommended_courses, roadmap)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        insert.run(
          user_id, 
          result.primary_domain, 
          result.secondary_domain, 
          result.compatibility_score, 
          JSON.stringify(result.recommended_courses), 
          JSON.stringify(result.roadmap)
        );
      }

      res.json(result);
    } catch (e: any) {
      console.error("Final Evaluation Error:", e);
      res.status(500).json({ error: "Failed to generate roadmap" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
