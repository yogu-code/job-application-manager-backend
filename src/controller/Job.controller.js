import Job from "../model/Job.model.js";
import mongoose from "mongoose";

export const addJob = async (req, res) => {
  try {
    const {
      jobTitle,
      applicationDate,
      jobLink,
      location,
      notes,
      company,
      position,
      status,
    } = req.body;

    // Validate required fields
    if (!jobTitle || !company || !position) {
      return res.status(400).json({ 
        message: "Job Title, Company, and Position are required fields." 
      });
    }

    // Validate status if provided
    if (status && !["Applied", "Interview", "Offer", "Rejected"].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: Applied, Interview, Offer, Rejected" 
      });
    }

    // Validate applicationDate if provided
    let parsedApplicationDate;
    if (applicationDate) {
      parsedApplicationDate = new Date(applicationDate);
      if (isNaN(parsedApplicationDate.getTime())) {
        return res.status(400).json({ 
          message: "Invalid application date format" 
        });
      }
    }

    // Create new job object
    const newJob = new Job({
      jobTitle,
      applicationDate: parsedApplicationDate || Date.now(),
      jobLink,
      location,
      note: notes, // Map notes to note field
      company,
      position,
      status: status || "Applied", // Default to Applied if not provided
    });

    // Save to database
    const savedJob = await newJob.save();
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: "Job application added successfully",
      data: savedJob
    });

  } catch (error) {
    console.error("Error in addJob:", error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }
    
    // Handle duplicate key errors (if you have unique indexes)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate field value: ${field}. Please use another value.`
      });
    }
    
    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

export const getAllJobs = (req, res) => {
  try {
    Job.find()
      .then((jobs) => res.status(200).json(jobs))
      .catch((error) =>
        res.status(500).json({ message: "Error fetching jobs", error })
      );
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getJob = (req, res) => {
  try {
    const { id } = req.params;
    Job.findById(id)
      .then((job) => {
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
      })
      .catch((error) =>
        res.status(500).json({ message: "Error fetching job", error })
      );
  } catch (error) {
    console.error("Error in getJob:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      jobTitle,
      applicationDate,
      jobLink,
      Location, // Note: capital L in request
      Note,     // Note: capital N in request
      company,
      position,
      status,
    } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid job ID format" 
      });
    }

    // Check if job exists
    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({ 
        success: false,
        message: "Job not found" 
      });
    }

    // Validate required fields
    if (!jobTitle || !company || !position) {
      return res.status(400).json({ 
        success: false,
        message: "Job Title, Company, and Position are required fields." 
      });
    }

    // Validate status if provided
    if (status && !["Applied", "Interview", "Offer", "Rejected"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status. Must be one of: Applied, Interview, Offer, Rejected" 
      });
    }

    // Validate applicationDate if provided
    let parsedApplicationDate;
    if (applicationDate) {
      parsedApplicationDate = new Date(applicationDate);
      if (isNaN(parsedApplicationDate.getTime())) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid application date format" 
        });
      }
    }

    // Prepare update object with correct field mapping
    const updateFields = {
      jobTitle,
      company,
      position,
      ...(jobLink && { jobLink }),
      ...(Location && { location: Location }), // Map Location to location
      ...(Note && { note: Note }),             // Map Note to note
      ...(status && { status }),
      ...(applicationDate && { applicationDate: parsedApplicationDate }),
    };

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob
    });

  } catch (error) {
    console.error("Error in updateJob:", error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }
    
    // Handle duplicate key errors (if you have unique indexes)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate field value: ${field}. Please use another value.`
      });
    }
    
    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
export const deleteJob = (req, res) => {
  try {
    const { id } = req.params;
    Job.findByIdAndDelete(id)
      .then((job) => {
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Job deleted successfully" });
      })
      .catch((error) =>
        res.status(500).json({ message: "Error deleting job", error })
      );
  } catch (error) {
    console.error("Error in deleteJob:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    console.log("Updating job ID:", id, "to status:", status);
    const job = await Job.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true } // ✅ ensure enum validation runs
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error in updateJobStatus:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid status value", error });
    }

    res.status(500).json({ message: "Error updating job status", error });
  }
};

export const getJobStats = async (req, res) => {
  try {
    // Get total number of jobs
    const totalJobs = await Job.countDocuments();

    // Get job counts by status using multiple queries (more reliable than aggregation)
    const [pending, interview, offer, rejected] = await Promise.all([
      Job.countDocuments({ status: "Applied" }),
      Job.countDocuments({ status: "Interview" }),
      Job.countDocuments({ status: "Offer" }),
      Job.countDocuments({ status: "Rejected" }),
    ]);

    const statusCounts = {
      pending,
      interview,
      offer,
      rejected,
    };

    // Get most recent job
    const recentJob = await Job.findOne()
      .sort({ applicationDate: -1 })
      .select("jobTitle company status applicationDate");

    res.status(200).json({
      totalJobs,
      statusCounts,
      recentJob,
    });
  } catch (error) {
    console.error("Error in getJobStatistics:", error);
    res.status(500).json({
      message: "Error fetching job statistics",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
