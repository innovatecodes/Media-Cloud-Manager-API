import { Router } from "express";
import { TubeServerManagerController } from "../controllers/tube-server-manager.controller";

const videoRoutes = Router();

videoRoutes.get(`/data`, TubeServerManagerController.getAllVideos);
videoRoutes.get(`/data/:id`, TubeServerManagerController.getVideoByid);
videoRoutes.post(`/data`, TubeServerManagerController.createVideo);

export default videoRoutes;
