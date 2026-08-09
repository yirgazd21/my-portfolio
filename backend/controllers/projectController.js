import Project from '../models/Project.js';

// PUBLIC
export const getProjects = async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
};

export const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const addReview = async (req, res) => {
  const { reviewerName, rating, comment } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  project.reviews.push({ reviewerName, rating, comment });
  await project.save();
  res.status(201).json({ message: 'Review added', project });
};

// ADMIN
export const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted' });
};

export const deleteReview = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  project.reviews.id(req.params.reviewId).deleteOne();
  await project.save();
  res.json({ message: 'Review deleted' });
};

export const toggleReviewApproval = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const review = project.reviews.id(req.params.reviewId);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  review.isApproved = !review.isApproved;
  await project.save();
  res.json({ message: 'Review approval toggled', review });
};
