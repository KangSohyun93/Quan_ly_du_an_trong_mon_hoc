const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'secret-key',
    { expiresIn: '1d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: 'Email was exits' });

    const newUser = new User({ email, password, name });
    await newUser.save();

    const token = createToken(newUser);

    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    res.status(500).json({ message: 'Sever error when register' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'The account is invalid' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    const token = createToken(user);

    res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Sever error when lognin' });
  }
};
