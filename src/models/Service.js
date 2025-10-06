import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    slug: String,
    title: {
      type: String,
      required: true,
    },
    shortTitle: String,
    description: {
      type: String,
      required: true,
    },
    detailedDescription: String,
    domainExpertise: String,
    icon: {
      type: String,
      required: true,
    },
    image: String,
    images: [String],
    category: String,
    industriesServed: [String],
    services: [String],
    features: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
