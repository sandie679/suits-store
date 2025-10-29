import mongoose from "mongoose";

const { Schema } = mongoose;

const styleSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

   
    link: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Style || mongoose.model("Style", styleSchema);
