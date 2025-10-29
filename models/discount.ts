import mongoose from "mongoose";

const { Schema } = mongoose;

const discountSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    linkText: { type: String, required: true },
    linkUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Discount || mongoose.model("Discount", discountSchema);
