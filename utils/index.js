const createTokenUser = require("./createTokenUser");
const { attachCookiesToResponse, isTokenValid } = require("./jwt");
const sendVerificationEmail = require("./sendVerificationEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const createHash = require("./createHash");

module.exports = {
  sendVerificationEmail,
  createTokenUser,
  attachCookiesToResponse,
  isTokenValid,
  sendResetPasswordEmail,
  createHash,
};
