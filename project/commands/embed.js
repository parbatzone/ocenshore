const { SlashCommandBuilder } = require('discord.js');
const { createCustomEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send a custom embed message')
    .addStringOption(option => option.setName('title').setDescription('Embed title').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Embed description').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('Hex color code (e.g. #3498db)').setRequired(false))
    .addStringOption(option => option.setName('image').setDescription('URL of image to include').setRequired(false)),
  
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color') || '#3498db';
    const image = interaction.options.getString('image');
    
    const embed = createCustomEmbed(title, description, color, [], image);
    
    await interaction.reply({ embeds: [embed] });
  },
};