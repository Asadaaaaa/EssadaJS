// v1
import PrimaryHandlerV1 from './primary/v1/Handler.route.js';

class Handler {
  constructor(server) {
    this.server = server;
    this.primary();
  }
  
  primary() {
    new PrimaryHandlerV1(this.server);
  }
}

export default Handler;