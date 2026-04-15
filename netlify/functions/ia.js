export default async function handler(event) {
    // Parse le body JSON envoyé par ton front
    let body = {};
    try {
        body = JSON.parse(event.body || "{}");
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON" })
        };
    }

    const action = body.action;
    if (!action) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing action" })
        };
    }

    // Appel à Mistral
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

    return {
        statusCode: 200,
        body: JSON.stringify({
            reply: data.choices?.[0]?.message?.content || "Erreur IA"
        })
    };
}
