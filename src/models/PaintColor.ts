
import mongoose, { Schema } from "mongoose";

const PaintColorSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    brand: {
      type: String,
      required: true,
      enum: [
        "Asian Paints",
        "Berger",
        "Dulux",
        "Nerolac",
        "JSW",
        "Indigo",
        "Other",
      ],
    },
    hex: {
      type: String,
      required: true,
      match: /^#[0-9a-fA-F]{6}$/,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Interior",
        "Exterior",
        "Wall",
        "Wood",
        "Metal",
        "Texture",
      ],
    },
    finish: {
      type: String,
      required: true,
      enum: ["Matte", "Satin", "Gloss", "Texture", "Eggshell"],
    },
    pricePer4L: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },
    roomImage: {
      type: String,
      default: "",
    },
    wallMaskType: {
      type: String,
      enum: ["living", "bedroom", "kitchen", "exterior"],
      default: "living",
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    suppressReservedKeysWarning: true,
  }
);

const PaintColor =
  mongoose.models.PaintColor ||
  mongoose.model("PaintColor", PaintColorSchema);

export default PaintColor;
