
import mongoose, { Schema } from "mongoose";

const WorkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    colorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: ["emulsion", "enamel", "distemper", "acrylic", "cement"],
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type WorkDocument = mongoose.InferSchemaType<typeof WorkSchema>;

const Work =
  mongoose.models.Work || mongoose.model("Work", WorkSchema);

export default Work;
