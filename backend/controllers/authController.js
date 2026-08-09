import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const admin = await AdminUser.findOne({ email }).select('+password');
  if (!admin || !(await admin.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(admin._id);
  res.json({
    token,
    admin: { id: admin._id, username: admin.username, email: admin.email, profileImage: admin.profileImage },
  });
};

export const getMe = async (req, res) => {
  res.json({ admin: req.admin });
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.find().select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAdmin = async (req, res) => {
  const { username, email, password, profileImage } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const admin = await AdminUser.create({ username, email, password, profileImage });
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      profileImage: admin.profileImage
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAdmin = async (req, res) => {
  const { username, email, password, profileImage } = req.body;
  try {
    const admin = await AdminUser.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    if (username) admin.username = username;
    if (email) admin.email = email;
    if (password) admin.password = password;
    if (profileImage !== undefined) admin.profileImage = profileImage;
    
    await admin.save();
    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      profileImage: admin.profileImage
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    if (req.params.id === req.admin._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }
    const admin = await AdminUser.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    await AdminUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin user deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPublicAdmin = async (req, res) => {
  try {
    const admin = await AdminUser.findOne().select('username email profileImage');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
