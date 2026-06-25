const authService = require('../services/auth.service');
const { loginSchema } = require('../validators/auth.validator');

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = await authService.login(value.email, value.password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({ email: req.user.email, isAdmin: req.user.isAdmin });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
