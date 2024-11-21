// Library
import Express from 'express';

//
import GlobalMiddleware from './rest/middlewares/Global.middleware.js';

class Rest {
  constructor(server) {
    this.server = server;
    this.route = Express();
    
    this.GlobalMiddleware = new GlobalMiddleware(this.server);
  }

  init() {
    this.GlobalMiddleware.global();
    new RouteHandler(this);
    this.GlobalMiddleware.missingRoute();
  }

  run() {
    this.route.listen(this.server.env.SERVER_PORT, () => {
      this.sendLogs(`Server running on port ${this.server.env.SERVER_PORT}`);
    });
  }
}

export default Rest;