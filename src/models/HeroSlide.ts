
import mongoose, { Schema, models, model } from "mongoose";

const HeroSlideSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 400,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    accentShade: {
      type: String,
      default: "",
    },

    accentHex: {
      type: String,
      default: "#000000",
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

    source: {
      type: String,
      enum: ["default", "upload"],
      default: "upload",
    },

    defaultKey: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

HeroSlideSchema.index(
  { defaultKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      defaultKey: { $type: "string" },
    },
  }
);

// Fix stale Mongoose model during Next.js development reload.
const existingModel = mongoose.models.HeroSlide;

if (
  existingModel &&
  !existingModel.schema.path("defaultKey")
) {
  mongoose.deleteModel("HeroSlide");
}

const HeroSlide =
  mongoose.models.HeroSlide ||
  mongoose.model("HeroSlide", HeroSlideSchema);

export default HeroSlide;
