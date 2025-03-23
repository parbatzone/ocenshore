const { SlashCommandBuilder } = require('discord.js');
const { createInfractionEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('infraction')
    .setDescription('Issue an infraction to a user')
    .addUserOption(option => option.setName('user').setDescription('User to issue infraction to').setRequired(true))
    .addStringOption(option => 
      option.setName('punishment')
        .setDescription('Type of punishment')
        .setRequired(true)
        .addChoices(
          { name: 'Notice', value: 'notice' },
          { name: 'Warning', value: 'warn' },
          { name: 'Strike', value: 'strike' },
          { name: 'Termination', value: 'termination' }
        )
    )
    .addStringOption(option => option.setName('reason').setDescription('Reason for infraction').setRequired(true)),
  
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const punishment = interaction.options.getString('punishment');
    const reason = interaction.options.getString('reason');
    
    const infractionEmbed = createInfractionEmbed(targetUser, reason, punishment, interaction.user);
    
    await interaction.reply({ embeds: [infractionEmbed] });
    
    try {
      await targetUser.send({ 
        content: `You have received an infraction in ${interaction.guild.name}.`,
        embeds: [infractionEmbed] 
      });
    } catch (error) {
      await interaction.followUp({ 
        content: `Note: Unable to send DM notification to ${targetUser.tag}.`,
        ephemeral: true 
      });
    }
  },
};
