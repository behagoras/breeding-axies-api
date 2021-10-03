import { Router } from 'express';
import { BASE_ENDPOINT } from '../../constants/endpoint';
import { getFormattedRoutes, getRoutes } from './server.status.service';

export const router: Router = Router();
export const SERVER_STATUS_ENDPOINT = BASE_ENDPOINT + "/";

// getStatus
router.get(`${SERVER_STATUS_ENDPOINT}`, (_, res) => {
  const routes = getFormattedRoutes();
  res.status(200).json({
    status: "server is running",
    numberOfRoutes: routes.length,
    routes,
  });
});