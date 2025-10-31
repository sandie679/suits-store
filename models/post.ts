import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
    }],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
