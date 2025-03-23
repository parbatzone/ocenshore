const fs = require('fs-extra');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../config.json');

async function getGuildSettings(guildId) {
  try {
    const config = await fs.readJson(CONFIG_PATH);
    if (!config.guildSettings[guildId]) {
      config.guildSettings[guildId] = {
        welcomeChannelId: null,
        sessionsChannelId: null
      };
      await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
    }
    return config.guildSettings[guildId];
  } catch (error) {
    console.error('Error getting guild settings:', error);
    return {
      welcomeChannelId: null,
      sessionsChannelId: null
    };
  }
}

async function updateGuildSettings(guildId, settings) {
  try {
    const config = await fs.readJson(CONFIG_PATH);
    config.guildSettings[guildId] = {
      ...config.guildSettings[guildId],
      ...settings
    };
    await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error updating guild settings:', error);
    return false;
  }
}

module.exports = {
  getGuildSettings,
  updateGuildSettings
};