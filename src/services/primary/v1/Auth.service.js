// Repositories
import { UserRepository } from '#repositoriesPrimaryV1';

// Helpers
import { JWTHelper, Sha256Helper } from '#helpers';

// Library

class AuthService {
    constructor(server) {
        this.server = server;

        this.UserRepository = new UserRepository(this.server);

        // Helpers
        this.JwtHelper = new JWTHelper(this.server);
        this.Sha256Helper = new Sha256Helper(this.server);
    }

    async login(identity, password) {
        const userModelData = await this.UserRepository.getUserDataByIdentity(identity);

        if (userModelData === null) return -1;

        if(userModelData.password !== this.Sha256Helper.getHash(password, this.server.env.HASH_SALT_PASSWORD)) return -1;
        
        const tokenData = {
            userId: userModelData.id
        }

        return this.JwtHelper.generateWithRefreshToken(tokenData, '1h');
    }
}

export default AuthService;