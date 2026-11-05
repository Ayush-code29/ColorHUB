import mongoose, { Schema, models, model } from "mongoose";

const HeroSlideSeedSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HeroSlideSeed =
  models.HeroSlideSeed ||
  model("HeroSlideSeed", HeroSlideSeedSchema);

export default HeroSlideSeed;