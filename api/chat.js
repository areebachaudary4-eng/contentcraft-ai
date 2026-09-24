// api/chat.js
// This runs on Vercel's server, NEVER in the user's browser.
// The API key lives here as an environment variable and is never sent to the client.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic check: make sure the server has the key configured
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server misconfigured: API key missing" });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request: 'messages' array required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://your-domain.vercel.app",
        "X-Title": "ContentCraft AI"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: messages,
        max_tokens: 600
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    console.error("OpenRouter proxy error:", err);
    return res.status(500).json({ error: "Failed to reach AI provider" });
  }
}
