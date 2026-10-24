
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tagline: {
      type: String,
      default: "",
      maxlength: 180,
    },
    
    accentColor: {
      type: String,
      default: "#D97706",
      match: /^#[0-9a-fA-F]{6}$/,
    },
    popularSeries: {
      type: String,
      default: "",
      maxlength: 180,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BrandSchema.pre("validate", function () {
  if (this.name) {
    this.normalizedName = this.name.trim().toLocaleLowerCase("en");
  }
});

export type BrandDocument = InferSchemaType<typeof BrandSchema>;

const Brand =
  mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

export default Brand;
