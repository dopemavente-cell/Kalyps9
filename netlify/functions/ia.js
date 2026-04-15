export default async function handler(event) {
    let body = {};
    try {
        body = JSON.parse(event.body || "{}");
    } catch (e) {
        return new Response(
            JSON.stringify({ error: "Invalid JSON" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const action = body.action;
    if (!action) {
        return new Response(
            JSON.stringify({ error: "Missing action" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
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

    const reply =
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.delta?.content ||
        data.choices?.[0]?.text ||
        "Réponse vide";

    return new Response(
        JSON.stringify({ reply }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}
