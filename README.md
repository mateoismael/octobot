# OctoBot - Discord Canvas Integration

Bot de Discord que permite vincular cuentas de Canvas mediante integración con n8n.

## 🚀 Deploy en Vercel

El proyecto está desplegado en: `https://octobot-three.vercel.app`

**Runtime:** Node.js 20.x (optimizado para octubre 2025)

### Variables de Entorno Requeridas

Configura estas variables en Vercel (Settings → Environment Variables):

- `DISCORD_PUBLIC_KEY` - Clave pública de tu aplicación Discord
- `N8N_FORM_URL` - URL del webhook de n8n para el formulario
- `DISCORD_APPLICATION_ID` - ID de tu aplicación Discord (solo para scripts)
- `DISCORD_BOT_TOKEN` - Token del bot (solo para scripts)

## 📋 Configuración Inicial

### 1. Obtener IDs necesarios

**DISCORD_APPLICATION_ID:**

- Ve a [Discord Developer Portal](https://discord.com/developers/applications)
- Selecciona tu aplicación
- Copia el "Application ID" en General Information

**DISCORD_PUBLIC_KEY:**

- En la misma página, copia "Public Key"

**DISCORD_BOT_TOKEN:**

- Ve a Bot → Reset Token (o copia si ya existe)
- ⚠️ Guárdalo en lugar seguro, solo se muestra una vez

**TEST_GUILD_ID (ID del servidor de Discord):**

- Abre Discord
- Ve a Configuración de Usuario → Avanzado → Modo Desarrollador (actívalo)
- Click derecho en tu servidor → Copiar ID del servidor

### 2. Configurar Endpoint en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. General Information → Interactions Endpoint URL
3. Pega: `https://octobot-three.vercel.app/api/interactions`
4. Guarda y espera la verificación ✅

### 3. Registrar Comandos Slash

En Windows PowerShell:

```powershell
$env:DISCORD_APPLICATION_ID="tu_app_id_aqui"
$env:DISCORD_BOT_TOKEN="tu_bot_token_aqui"
$env:TEST_GUILD_ID="tu_guild_id_aqui"
node scripts/register-commands.js
```

En Linux/Mac:

```bash
export DISCORD_APPLICATION_ID="tu_app_id_aqui"
export DISCORD_BOT_TOKEN="tu_bot_token_aqui"
export TEST_GUILD_ID="tu_guild_id_aqui"
node scripts/register-commands.js
```

## 🎯 Uso

Una vez configurado, los usuarios pueden ejecutar `/vincular` en tu servidor de Discord para obtener un botón que los llevará al formulario de Canvas.

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# El proyecto usa Vercel Functions con Node.js runtime
# Para desarrollo local, instala Vercel CLI:
npm install -g vercel

# Ejecutar en desarrollo local
vercel dev
```

## 📁 Estructura del Proyecto

```
octobot/
├── api/
│   └── interactions.js    # Handler de interacciones Discord
├── scripts/
│   └── register-commands.js  # Script para registrar comandos
├── .env.example           # Plantilla de variables de entorno
├── .gitignore
└── package.json
```

## 🔒 Seguridad

- Todas las requests son validadas con firma de Discord
- Variables sensibles nunca se incluyen en el código
- Mensajes efímeros (solo visible para el usuario)

## 📝 Comandos Disponibles

- `/vincular` - Genera un enlace personalizado para vincular Canvas

## 🐛 Troubleshooting

**Error: "Bad request signature"**

- Verifica que `DISCORD_PUBLIC_KEY` esté correctamente configurado en Vercel

**Error: "Method not allowed"**

- Normal al acceder por navegador, Discord usa POST

**Comando no aparece en Discord:**

- Ejecuta nuevamente `register-commands.js`
- Espera unos minutos o reinicia Discord

## 📄 Licencia

ISC
