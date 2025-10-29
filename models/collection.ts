import mongoose from "mongoose";

const { Schema } = mongoose;

const collectionSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    link: { type: String, required: true },
   
  },
  { timestamps: true }
);

export default mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
