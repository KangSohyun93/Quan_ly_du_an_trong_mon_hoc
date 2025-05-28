const { SystemConfiguration, User } = require('../models');

// Định nghĩa hàm thông thường thay vì exports.functionName
const getConfigurations = async (req, res) => {
  try {
    const configurations = await SystemConfiguration.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'updatedBy',
        },
      ],
      attributes: ['config_id', 'config_key', 'config_value', 'updated_at'],
    });

    const response = configurations.map(config => ({
      config_id: config.config_id,
      config_key: config.config_key,
      config_value: config.config_value,
      updated_at: config.updated_at,
      updated_by: config.updatedBy?.username,
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching configurations:', error);
    res.status(500).json({ message: 'Error fetching configurations' });
  }
};

const saveConfiguration = async (req, res) => {
  const { config_id, config_key, config_value, updated_by } = req.body;
  try {
    if (config_id) {
      const config = await SystemConfiguration.findOne({ where: { config_id } });
      if (!config) {
        return res.status(404).json({ message: 'Configuration not found' });
      }
      await config.update({
        config_key,
        config_value,
        updated_by,
        updated_at: new Date(),
      });
    } else {
      await SystemConfiguration.create({
        config_key,
        config_value,
        updated_by,
        updated_at: new Date(),
      });
    }
    res.json({ message: 'Configuration saved successfully' });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ message: 'Error saving configuration' });
  }
};

module.exports = { getConfigurations, saveConfiguration };