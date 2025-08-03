import { ResponsePresetHelper } from '#helpers';
import { AuthValidator } from '#validatorsPrimaryV1';
import { AuthService } from '#servicesPrimaryV1';

// Library
import Ajv from 'ajv';

class AuthController {
    constructor(server) {
        this.server = server;

        this.ResponsePreset = new ResponsePresetHelper();
        this.Ajv = new Ajv();
        this.DataScheme = new AuthValidator();
        this.AuthService = new AuthService(this.server);
    }

    async login(req, res) {
        const schemeValidate = this.Ajv.compile(this.DataScheme.login);
        if (!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
            400,
            schemeValidate.errors[0].message,
            'validator',
            schemeValidate.errors[0]
        ));

        const { identity, password } = req.body;
        const loginSrv = await this.AuthService.login(identity, password);

        if (loginSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(
            404,
            'Not Found, Identity or Password is wrong',
            'service',
            { code: -1 }
        ));

        return res.status(200).json(this.ResponsePreset.resOK('OK', loginSrv))
    }
}

export default AuthController;