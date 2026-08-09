import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Project title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, maxlength: 150 },
    images: [{ type: String }], // URLs or file paths
    sourceCodeLink: { type: String, trim: true },
    liveLink: { type: String, trim: true },
    techStack: [{ type: String }],
    category: {
      type: String,
      enum: ['Web App', 'Mobile App', 'API', 'ML/AI', 'Other'],
      default: 'Web App',
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// Virtual for average rating
projectSchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) return 0;
  const approved = this.reviews.filter((r) => r.isApproved);
  if (approved.length === 0) return 0;
  const sum = approved.reduce((acc, r) => acc + r.rating, 0);
  return (sum / approved.length).toFixed(1);
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

export default mongoose.model('Project', projectSchema);
