const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('playlist')
            .setDescription('Manda o Link da Playlist do Spotify'),
    async execute(interaction) {
        await interaction.reply('Link da Playlist');
    }
}

