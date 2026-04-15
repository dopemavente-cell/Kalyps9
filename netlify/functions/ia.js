export default async function handler(req, res) {
    let body = {};

    try {
        body = JSON.parse(req.body || "{}");
    } catch (e) {
        return res.status(400).json({ error: "Invalid JSON" });
    }

    const action = body.action;
    if (!action) {
        return res.status(400).json({ error: "Missing action" });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.mistral_api_key}`
        },
        body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
                {
                    role: "system",
                    content:
"Tu es la narration de Kalyps‑9. Style sombre, réaliste, nerveux. \
Pas de pouvoirs impossibles. Pas de violence graphique. \
Le joueur est un journaliste sans compétences de combat."
                },
                { role: "user", content: action }
            ]
        })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "Erreur IA" });
}
