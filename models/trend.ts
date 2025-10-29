import mongoose from "mongoose";

const { Schema } = mongoose;

const trendSchema = new Schema(
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

export default mongoose.models.Trend || mongoose.model("Trend", trendSchema);
