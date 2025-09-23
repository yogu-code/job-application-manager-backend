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
      validate: {
        validator: function(v) {
          return !v || /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    },
    location: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,  // Made position required
      trim: true,
      maxlength: 100
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for formatted application date
jobSchema.virtual('formattedDate').get(function() {
  return this.applicationDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual for days since application
jobSchema.virtual('daysSinceApplication').get(function() {
  const today = new Date();
  const applicationDate = new Date(this.applicationDate);
  const diffTime = Math.abs(today - applicationDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
});

// Index for better query performance
jobSchema.index({ status: 1, applicationDate: -1 });
jobSchema.index({ company: 1, position: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;