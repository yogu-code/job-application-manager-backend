import express from "express";
import { getAllJobs , getJob , addJob, updateJob, deleteJob , updateJobStatus } from "../controller/Job.controller.js";
const router = express.Router();

router.post("/add", addJob);
router.get("/all", getAllJobs);
router.get("/:id", getJob);
router.put("/:id", updateJob);
router.patch("/:id", updateJobStatus);
router.delete("/:id", deleteJob);


export default router;