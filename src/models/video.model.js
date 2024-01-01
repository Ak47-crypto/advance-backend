import mongoose from "mongoose";
const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, //cloudinary url
      required: true,
    },
    thumbnail: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    views: {
      type: Number,
      default:0
    },
    isPublished: {
      type: Boolean,
      default:true
    },
  },
  { timestamps: true }
);
export const Video = mongoose.model("video",videoSchema)