import { request } from "undici";

const APP_ID = process.env.DISCORD_APPLICATION_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.TEST_GUILD_ID;

// Validar que todas las variables estén presentes
if (!APP_ID) {
  console.error("❌ Falta DISCORD_APPLICATION_ID");
  process.exit(1);
}

if (!BOT_TOKEN) {
  console.error("❌ Falta DISCORD_BOT_TOKEN");
  process.exit(1);
}

if (!GUILD_ID) {
  console.error("❌ Falta TEST_GUILD_ID");
  process.exit(1);
}

const commands = [
  {
    name: "vincular",
    description: "Vincula tu cuenta Canvas con OctoBot",
    type: 1,
  },
];

async function registerCommands() {
  const url = `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;

  console.log("🔄 Registrando comando /vincular...");

  try {
    const res = await request(url, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    });

    const body = await res.body.text();

    if (res.statusCode < 300) {
      console.log("✅ /vincular registrado correctamente");
      console.log("📋 Respuesta:", JSON.parse(body));
    } else {
      console.error("❌ Error al registrar:", res.statusCode);
      console.error("📋 Detalles:", body);
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
}

registerCommands();
