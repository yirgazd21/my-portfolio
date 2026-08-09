import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Skill name is required'], trim: true },
    icon: { type: String, default: '' }, // URL or emoji or icon class
    proficiency: { type: Number, min: 0, max: 100, default: 80 }, // percentage
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Tools', 'Other'],
      default: 'Other',
      set: (v) => {
        if (!v) return v;
        const allowed = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Tools', 'Other'];
        const matched = allowed.find(a => a.toLowerCase() === v.toLowerCase());
        return matched || v;
      }
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
