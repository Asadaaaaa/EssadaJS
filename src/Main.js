// Helpers
import { LoggerHelper as sendLogs } from '#helpers';

// Handlers
import MiddlewareHandler from './middlewares/Handler.middleware.js';
import RouteHandler from './routes/Handler.route.js';
import ModelHandler from './models/Handler.model.js';

// Library
import * as dotenv from 'dotenv';
import os from 'os';
import cluster from 'cluster';
import FS from 'fs-extra';
import Express from 'express';

class Server {
    constructor() {
        // Server Logger
        this.sendLogs = sendLogs;

        // File System
        this.FS = FS;

        // .env config

        // check if .env file exists
        if (!this.FS.existsSync('.env')) {
            this.sendLogs('Error: .env file not found. please use the .env.example file to create a new .env file');
            return;
        }

        dotenv.config();
        this.env = process.env;
        

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
        if(this.env.DB_ENABLE === 'true') {
          this.model = new ModelHandler(this);
          const isModelConnected = await this.model.connect();

          if (isModelConnected === -1) return;
        }

        this.run();
    }

    run() {
        this.API = Express();

        new MiddlewareHandler(this);
        new RouteHandler(this);
        //handler if port already in use
        this.API.listen(this.env.PORT, this.env.IP, () => {
            this.sendLogs(`Server Started, Listening PORT ${this.env.PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                this.sendLogs(`Port ${this.env.PORT} is already in use`);
                process.exit(1);
            }
        });
    }
}

new Server();
