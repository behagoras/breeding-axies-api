import config from '../../../config.json';
import app from '../../server';

const port = Number(process.env.PORT || config.PORT || 8080);
const domain = process.env.HOST || config.HOST || 'localhost';

export const getRoutes = (): Array<any> => {
  let route: any;
  const routes: Array<any> = [];

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) { // routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === 'router') { // router middleware 
      middleware.handle.stack.forEach((handler: any) => {
        route = handler.route;
        route && routes.push(route);
      });
    }
  });

  return routes;
}

export const getFormattedRoutes = () => {
  const routes = getRoutes()
  return routes.map(route => {
    return {
      method: route.stack[0].method.toUpperCase(),
      path: route.path,
      endpoint: `${domain}:${port}${route.path}`
    };
  })
    .sort((a, b) => a.path.localeCompare(b.path));
}
