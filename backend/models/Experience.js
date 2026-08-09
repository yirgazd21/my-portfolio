import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['work', 'education'],
      required: true,
    },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    organization: { type: String, required: [true, 'Organization is required'], trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null = present
    current: { type: Boolean, default: false },
    description: { type: String, trim: true },
    skills: [{ type: String }], // related skills/technologies
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
