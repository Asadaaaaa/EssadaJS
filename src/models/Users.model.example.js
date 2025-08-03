import { DataTypes } from "sequelize";

class UsersModel {
  constructor(server) {
    const table = server.model.db.define('users', 
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: server.model.db.literal(`gen_random_uuid()`)
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'masterdata_country',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      phone_number: {
        type: DataTypes.STRING(16),
        allowNull: false
      },
      phone_number_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      username: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      sign_name: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      nik: {
        type: DataTypes.STRING(16),
        allowNull: true
      },
      passport_id: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      selfie: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      image_path: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      identity_proof: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      app_pin: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      hashing_salt: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      rsa_private_key: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      rsa_public_key: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    }, {
      tableName: 'users',
      timestamps: false
    });

    this.table = table;
  }
}

export default UsersModel;