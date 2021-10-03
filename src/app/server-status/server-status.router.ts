import { Router } from 'express';
import { getFormattedRoutes, getRoutes } from './server.status.service';

export const router: Router = Router();
export const SERVER_STATUS_ENDPOINT = "/";

// getStatus
router.get(`${SERVER_STATUS_ENDPOINT}`, (_, res) => {
  const routes = getFormattedRoutes();
  res.status(200).json({
    status: "server is running",
    numberOfRoutes: routes.length,
    routes,
  });
});