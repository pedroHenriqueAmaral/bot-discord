// Classes necessárias do Discord.js
const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');

// Arquivo .env
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN } = process.env;

// Criando uma nova instância Cliente
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Importando da pasta "commands"
const path = require('node:path'); // Módulo nativo para caminho de arquivos
const fs = require('node:fs');      // Módulo nativo para arquivos
const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Array dos comandos

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const commands = require(filePath);
    if('data' in commands && 'execute' in commands) {
        client.commands.set(commands.data.name, commands);
    } else {
        console.log('${filePath} com "data" e/ou "execute" ausentes');
    }
}

// Quando o cliente está pronto, roda este comando (apenas uma vez)
client.once(Events.ClientReady, c => {
	console.log(`Faíscas Prontas! ${c.user.tag} Online!`);
});

// Loga no Discord com o Token gerado na página do bot
client.login(TOKEN);

// Listener
client.on(Events.InteractionCreate, async interation => {
    /*
    client.setActivity({
        type: ActivityType.Playing,
        name: 'Coffee'
    });
    */

    if (!interation.isChatInputCommand()) return
    // console.log(interation);

    const command = interation.client.commands.get(interation.commandName); // Nome do comando que foi chamado
    if (!command) {
        console.error('Comando não foi encontrado');
        return;
    }

    try {
        await command.execute(interation);
    } catch (error) {
        console.error(error);
        await interation.reply('Erro ao tentar rodar o comando');
    }
});