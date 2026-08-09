import Skill from '../models/Skill.js';

export const getSkills = async (_req, res) => {
  const skills = await Skill.find().sort({ order: 1 });
  res.json(skills);
};

export const createSkill = async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
};

export const updateSkill = async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!skill) return res.status(404).json({ message: 'Skill not found' });
  res.json(skill);
};

export const deleteSkill = async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return res.status(404).json({ message: 'Skill not found' });
  res.json({ message: 'Skill deleted' });
};
