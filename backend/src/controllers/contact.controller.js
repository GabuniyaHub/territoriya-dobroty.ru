const contactService = require('../services/contact.service');

exports.sendMessage = async (req, res) => {
  try {
    await contactService.createMessage(req.body);
    res.json({ message: 'Сообщение отправлено' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
