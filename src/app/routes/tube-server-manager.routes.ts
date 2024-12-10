import { Router } from "express";
import { TubeServerManagerController } from "../controllers/tube-server-manager.controller";

const videoRoutes = Router();

videoRoutes.get(`/videos`,  TubeServerManagerController.getAllVideos);
videoRoutes.get(`/videos/:id`, TubeServerManagerController.getVideoByid);
videoRoutes.post(`/videos`, TubeServerManagerController.createVideo);
videoRoutes.put(`/videos/:id`, TubeServerManagerController.updateVideo);
videoRoutes.delete(`/videos/:id`, TubeServerManagerController.deleteVideo);

export default videoRoutes;
