import Experience from '../models/Experience.js';

export const getExperiences = async (_req, res) => {
  const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
  res.json(experiences);
};

export const createExperience = async (req, res) => {
  const exp = await Experience.create(req.body);
  res.status(201).json(exp);
};

export const updateExperience = async (req, res) => {
  const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!exp) return res.status(404).json({ message: 'Entry not found' });
  res.json(exp);
};

export const deleteExperience = async (req, res) => {
  const exp = await Experience.findByIdAndDelete(req.params.id);
  if (!exp) return res.status(404).json({ message: 'Entry not found' });
  res.json({ message: 'Entry deleted' });
};
