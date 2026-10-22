
import mongoose, { Schema } from "mongoose";

const OfferSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    buttonLink: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
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

const Offer =
  mongoose.models.Offer ||
  mongoose.model("Offer", OfferSchema);

export default Offer;
