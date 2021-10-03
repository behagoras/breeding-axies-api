import app from './server';
import config from '../config.json';
import { getFormattedRoutes, getRoutes } from './app/server-status/server.status.service';

// Start the application by listening to specific port
const port = Number(process.env.PORT || config.PORT || 8080);
app.listen(port, () => {
  const routes = getRoutes();
  const formattedRoutes = getFormattedRoutes();
  console.info('Express application started on port: ' + port);
  console.table(formattedRoutes);
});

