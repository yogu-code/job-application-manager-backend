import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    jobLink: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Job = mongoose.model("Job", jobSchema);

export default Job;