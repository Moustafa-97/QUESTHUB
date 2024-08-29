const jwt = require("jsonwebtoken");

module.exports.GenerateUserToken = async (res, ID, next) => {
  const maxAge = 9 * 24 * 60 * 60 * 1000;
  const token = await jwt.sign({ ID }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });

  await res.cookie(process.env.USER_TOKEN, token, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "None",
    maxAge: 9 * 24 * 60 * 60 * 1000,
  });

};
