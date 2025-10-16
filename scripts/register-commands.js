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

// Modo: "guild" (por defecto) o "global"
const mode = (process.argv[2] || "guild").toLowerCase();

if (mode === "guild" && !GUILD_ID) {
  console.error("❌ Falta TEST_GUILD_ID para registrar en guild");
  process.exit(1);
}

const commands = [
  {
    name: "vincular",
    description: "Vincula tu cuenta Canvas con OctoBot",
    type: 1,
  },
];

const url =
  mode === "global"
    ? // GLOBAL: aparece en todos los servidores/DM donde esté el bot (tarda en propagarse)
      `https://discord.com/api/v10/applications/${APP_ID}/commands`
    : // GUILD: solo en un servidor, aparece inmediato
      `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;

async function registerCommands() {
  console.log(`🔄 Registrando comandos en modo: ${mode.toUpperCase()}`);
  console.log(`📡 URL: ${url}`);

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
      console.log("✅ Comandos registrados correctamente");
      try {
        const parsed = JSON.parse(body);
        console.log("📋 Respuesta:", parsed);
      } catch {
        console.log(body);
      }
    } else {
      console.error("❌ Error al registrar:", res.statusCode);
      console.error("📋 Detalles:", body);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    process.exit(1);
  }
}

registerCommands();
