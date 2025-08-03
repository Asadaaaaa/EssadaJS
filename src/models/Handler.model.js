// Library
import { Sequelize } from "sequelize";

class Handler {
    constructor(server) {
        this.server = server;
    }

    async connect() {
        this.server.sendLogs('Connecting to database...');
        try {
            this.db = new Sequelize({
                host: this.server.env.DB_HOST,
                port: this.server.env.DB_PORT,
                username: this.server.env.DB_USERNAME,
                password: this.server.env.DB_PASSWORD,
                database: this.server.env.DB_DATABASE,
                dialect: this.server.env.DB_DIALECT,
                logging: this.server.env.DB_LOGGING === 'true' ? (sql, queryObject) => {
                    this.server.sendLogs('Query: ' + sql + '\n- Details Object: ' + JSON.stringify({
                        model: queryObject.model ? queryObject.model.name : null,
                        type: queryObject.type,
                        fields: queryObject.fields ? queryObject.fields.join(', ') : null
                    }, null, 2));
                } : false
            });
            await this.db.authenticate();
        } catch (err) {
            this.server.sendLogs(err);
            return -1;
        }

        this.server.sendLogs(`Database "${this.db.config.database}" Connected`);
        
        return this.db;
    }
}

export default Handler;
