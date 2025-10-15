import {
  verifyKey,
  InteractionType,
  InteractionResponseType,
} from "discord-interactions";

const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
const N8N_FORM = process.env.N8N_FORM_URL;

// Validar variables de entorno requeridas
if (!PUBLIC_KEY) {
  throw new Error("DISCORD_PUBLIC_KEY is required");
}

if (!N8N_FORM) {
  throw new Error("N8N_FORM_URL is required");
}

export const config = { runtime: "edge" };

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json" },
  });
}

async function isValidRequest(req, raw) {
  const sig = req.headers.get("x-signature-ed25519") || "";
  const ts = req.headers.get("x-signature-timestamp") || "";

  if (!sig || !ts) {
    return false;
  }

  try {
    return verifyKey(raw, sig, ts, PUBLIC_KEY);
  } catch (error) {
    console.error("Error validating request signature:", error);
    return false;
  }
}

export default async function handler(req) {
  try {
    // Validar método HTTP
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const raw = await req.text();

    if (!raw) {
      return new Response("Empty request body", { status: 400 });
    }

    if (!(await isValidRequest(req, raw))) {
      return new Response("Bad request signature", { status: 401 });
    }

    let i;
    try {
      i = JSON.parse(raw);
    } catch (error) {
      console.error("JSON parsing error:", error);
      return new Response("Invalid JSON", { status: 400 });
    }

    if (i.type === InteractionType.PING) return json({ type: 1 });

    if (i.type === InteractionType.APPLICATION_COMMAND) {
      const name = i.data?.name;
      if (name === "vincular") {
        const userId = i.user?.id || i.member?.user?.id || "";

        if (!userId) {
          return json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              flags: 64,
              content:
                "⚠️ No se pudo obtener tu ID de usuario. Intenta de nuevo.",
            },
          });
        }

        const url = `${N8N_FORM}?state=${encodeURIComponent(userId)}`;
        return json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: 64,
            content: "Abre el formulario para vincular tu Canvas:",
            components: [
              {
                type: 1,
                components: [
                  { type: 2, style: 5, label: "Vincular con Canvas", url },
                ],
              },
            ],
          },
        });
      }
    }

    return json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { flags: 64, content: "Comando no reconocido." },
    });
  } catch (error) {
    console.error("Error handling interaction:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
