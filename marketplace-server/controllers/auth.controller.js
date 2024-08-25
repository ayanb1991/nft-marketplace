const admin = require('firebase-admin');
const firebase = require("../firebase");

class AuthController {
  constructor() {
    firebase.init();
    this.auth = admin.auth();
  }

  async signup(signupData) {
    try {
      const { email, password, displayName } = signupData;
      return await this.auth.createUser({
        email,
        password,
        displayName,
        disabled: false
      });
    } catch (error) {
      throw new Error(`Signup error: ${error.message}`);
    }
  }

  async verifyIdToken(idToken) {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error(`Token verification error: ${error.message}`);
    }
  }

  async revokeRefreshTokens(uid) {
    try {
      await this.auth.revokeRefreshTokens(uid);
      return true;
    } catch (error) {
      throw new Error(`Logout error: ${error.message}`);
    }
  }
}

module.exports = new AuthController();