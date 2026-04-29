const express = require("express");
const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Serve arquivos estáticos (o index.html)
app.use(express.static("public"));

// Rota da IA (substitui a Netlify Function)
app.post("/chat", async (req, res) => {
  try {
    const { messages, temperature, max_tokens } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: temperature ?? 0.75,
        max_tokens: max_tokens ?? 800
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
