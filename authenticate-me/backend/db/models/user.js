'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
const Validator = require('validator');
const { Op } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    toSafeObject() {
      const { id, username, email } = this;
      return { id, username, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static async getCurrentUserById(id) {
      return await User.scope('currentUser').findByPk(id);
    }

    static async login({ credential, password }) {
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]:{
            username: credential,
            email: credential
          }
        }
      });

      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ username, email, password }) {
      const hashedPassword  = bcrypt.hashSync(password);

      const newUser = await User.create({
        username,
        email,
        hashedPassword
      });

      return await User.scope('currentUser').findByPk(newUser.id)
    }

    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value){
          if (Validator.isEmail(value)){
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail(value){
          if (!Validator.isEmail(value)){
            throw new Error("Must be a valid email address.");
          }
        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ["hashedPassword"]
        }
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};