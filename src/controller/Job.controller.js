import Job from "../model/Job.model.js";

export const addJob = (req, res) => {
    try {
        const { jobTitle , applicationDate , jobLink , Location , Note , company, position } = req.body;
        if(!jobTitle || !company){
            return res.status(400).json({ message: "Job Title and Company are required." });
        }
        const newJob = new Job({
            jobTitle,
            applicationDate,
            jobLink,
            Location,
            Note,
            company,
            position
        });
        newJob.save()
        .then((job) => res.status(201).json(job))
        .catch((error) => res.status(500).json({ message: "Error saving job", error }));    
    } catch (error) {
        console.error("Error in addJob:", error);
        res.status(500).json({ message: "Server Error", error });
    }
} 

export const getAllJobs = (req, res) => {
  try {
    Job.find()
    .then((jobs) => res.status(200).json(jobs))
    .catch((error) => res.status(500).json({ message: "Error fetching jobs", error }));
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    res.status(500).json({ message: "Server Error", error });
  }
}

export const getJob = (req, res) => {
  try {
    const { id } = req.params;
    Job.findById(id)
    .then((job) => {
      if(!job){
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json(job);
    })
    .catch((error) => res.status(500).json({ message: "Error fetching job", error }));
  } catch (error) {
    console.error("Error in getJob:", error);
    res.status(500).json({ message: "Server Error", error });
  }
}

export const updateJob = (req, res) => {
  try {
    const { id } = req.params;
    const { jobTitle , applicationDate , jobLink , Location , Note , company, position } = req.body;
    if(!jobTitle || !company){
      return res.status(400).json({ message: "Job Title and Company are required." });
    }
    Job.findByIdAndUpdate(id, {
      jobTitle,
      applicationDate,
      jobLink,
      Location,
      Note,
      company,
      position
    }, { new: true })
    .then((job) => {
      if(!job){
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json(job);
    })
    .catch((error) => res.status(500).json({ message: "Error updating job", error }));
  } catch (error) {
    console.error("Error in updateJob:", error);
    res.status(500).json({ message: "Server Error", error });
  }
}

export const deleteJob = (req, res) => {
  try {
    const { id } = req.params;
    Job.findByIdAndDelete(id)
    .then((job) => {
      if(!job){
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json({ message: "Job deleted successfully" });
    })
    .catch((error) => res.status(500).json({ message: "Error deleting job", error }));
  } catch (error) {
    console.error("Error in deleteJob:", error);
    res.status(500).json({ message: "Server Error", error });
  }
}
