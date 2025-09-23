import express from "express";
import { getAllJobs , getJob , addJob, updateJob, deleteJob , updateJobStatus, getJobStats } from "../controller/Job.controller.js";
const router = express.Router();

router.post("/add", addJob);
router.get("/all", getAllJobs);
router.get("/:id", getJob);
router.put("/:id", updateJob);
router.patch("/:id", updateJobStatus);
router.delete("/:id", deleteJob);
router.get("/status", getJobStats);


export default router;