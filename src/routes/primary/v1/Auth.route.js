import { AuthController } from '#controllersPrimaryV1';

// Middlewares
import { Authorization } from '#middlewaresPrimaryV1';

class AuthRoute {
    constructor(server, endpointPrefix) {
        this.server = server;
        this.API = server.API;

        this.endpointPrefix = endpointPrefix + '/auth';
        this.Authorization = new Authorization(this.server);

        this.AuthController = new AuthController(this.server);

        this.routes();
    }

    routes() {
        this.API.post(this.endpointPrefix + '/login', (req, res) => this.AuthController.login(req, res));

    }
}

export default AuthRoute;