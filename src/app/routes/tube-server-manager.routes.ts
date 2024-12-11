import { Router } from "express";
import { TubeServerManagerController } from "../controllers/tube-server-manager.controller";
import { EndPoint } from "../utils/utils";

export const videoRoutes = Router();

videoRoutes.get(EndPoint.VIDEOS,  TubeServerManagerController.getAllVideos);
videoRoutes.get(EndPoint.VIDEOS_SEARCH,  TubeServerManagerController.search);
videoRoutes.get(EndPoint.VIDEO_BY_ID, TubeServerManagerController.getVideoByid);
videoRoutes.post(EndPoint.VIDEOS, TubeServerManagerController.createVideo);
videoRoutes.put(EndPoint.VIDEO_BY_ID, TubeServerManagerController.updateVideo);
videoRoutes.delete(EndPoint.VIDEO_BY_ID, TubeServerManagerController.deleteVideo);
