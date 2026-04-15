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
                { role: "system", content: "Tu es la narration de Kalyps‑9." },
                { role: "user", content: action }
            ]
        })
    });

    const data = await response.json();

    // 🔥 On renvoie TOUT tel quel
    return new Response(
        JSON.stringify(data, null, 2),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}
