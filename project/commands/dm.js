const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a direct message to a member')
    .addUserOption(option => option.setName('user').setDescription('User to send message to').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Message to send').setRequired(true)),
  
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const message = interaction.options.getString('message');
    
    try {
      await targetUser.send({
        content: message,
        components: [
          {
            type: 1, // Action Row
            components: [
              {
                type: 2, // Button
                style: 5, // Link
                label: 'Sent from Server',
                url: interaction.guild.inviteURL || `https://discord.com/channels/${interaction.guild.id}`
              }
            ]
          }
        ]
      });
      
      await interaction.reply({ content: `Message sent to ${targetUser.tag}!`, ephemeral: true });
    } catch (error) {
      console.error('Error sending DM:', error);
      await interaction.reply({ 
        content: `Failed to send message to ${targetUser.tag}. They may have DMs disabled.`, 
        ephemeral: true 
      });
    }
  },
};