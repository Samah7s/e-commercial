import { Express } from "express";
import { RouteHandler } from "../lib/routes";

export function defineRoutes(controllers: any, app: Express) {
  for (let i = 0; i < controllers.length; i++) {
    const controller = new controllers[i]();

    const routeHandlers: RouteHandler = Reflect.getMetadata(
      "routeHandlers",
      controller
    );
    const controllerPath: String = Reflect.getMetadata(
      "baseRoute",
      controller.constructor
    );
    const methods = Array.from(routeHandlers.keys());
    methods.forEach((method) => {
      const routes = routeHandlers.get(method);
      if (routes) {
        const routeNames = Array.from(routes.keys());
        routeNames.forEach((routeName) => {
          const handlers = routes.get(routeName);
          if (handlers) {
            app[method](controllerPath + routeName, handlers);
            console.log("Loading route: ", method, controllerPath + routeName);
          }
        });
      }
    });
  }
}
