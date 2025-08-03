// Models

class UserRepository {
    constructor(server) {
        this.server = server;

        // Models
    }

    async getUserDataByIdentity(identity) {
      if(identity !== 'john') return null;

        return {
            id: 1,
            username: 'john',
            password: 'f9eb50fd125e7c9da337a662a5ece801b82e6998251d5c462fd64f689e7e0b33'
        };
    }
    
}

export default UserRepository;