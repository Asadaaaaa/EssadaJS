// Helpers
import sendLogs from './helpers/Logger.helper.js';

// Main
import Rest from './Rest.js';

// Handlers
import MiddlewareHandler from './middlewares/Handler.middleware.js';
import RouteHandler from './routes/Handler.route.js';
// import ModelHandler from './models/Handler.model.js';

// Library
import * as dotenv from 'dotenv';
import os from 'os';
import cluster from 'cluster';
import FS from 'fs-extra';

class Server {
  constructor() {
    // Server Logger
    this.sendLogs = sendLogs;
    
    // File System
    this.FS = FS;

    // .env config
    dotenv.config();
    this.env = process.env;

    // REST
    this.Rest = new Rest();

    this.serverThreads();
  }

  serverThreads() { 
    // Total Server CPUs
    const numCPUs = os.cpus().length;

    if (cluster.isPrimary) {
      this.sendLogs(`Total CPUs ${numCPUs}`);
      this.sendLogs(`Starting Server with ${this.env.SERVER_THREADS} threads...`);

      // Fork workers.
      for (let i = 0; i < this.env.SERVER_THREADS; i++) {
        cluster.fork();
      }

      // This event worker died
      cluster.on('exit', (worker) => {
        this.sendLogs(`worker ${worker.process.pid} died`);
      });
    } else {
      this.init();
    }
  }

  async init() {
    // Initiate Server Data
    const serverDataPath = '/server_data';
    const resourceFolder = '/src/resources';

    if (!FS.existsSync(process.cwd() + serverDataPath)) {
      this.sendLogs('Initiate Server Data...');
      this.FS.mkdirSync(process.cwd() + serverDataPath);
      this.FS.copySync(process.cwd() + resourceFolder, process.cwd() + serverDataPath);
    }

    /* this.model = new ModelHandler(this);
    const isModelConnected = await this.model.connect();

    if (isModelConnected === -1) return; */
    
    this.Rest.init();

    this.run();
  }

  run() {
    this.Rest.run();
  }
}

new Server();