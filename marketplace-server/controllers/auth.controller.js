const admin = require('firebase-admin');
const firebase = require("../firebase");

class AuthController {
  constructor() {
    firebase.init();
    this.auth = admin.auth();
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