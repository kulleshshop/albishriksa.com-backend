import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    image: String,
    status: {
      type: String,
      enum: ["completed", "ongoing", "in-progress", "planned"],
      default: "completed",
    },
    year: String,
    images: [String],
    detailedDescription: String,
    startDate: String,
    endDate: String,
    budget: String,
    services: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
