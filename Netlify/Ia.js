export default async function handler(req, res) {
    const { action } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.mistral_api_key}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
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
    res.status(200).json(data);
}
