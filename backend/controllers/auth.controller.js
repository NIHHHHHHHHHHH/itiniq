
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, data: null, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email } },
      message: 'Account created successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, data: null, message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email } },
      message: 'Logged in successfully',
    });
  } catch (err) {
    next(err);
  }
};