const jwt = require("jsonwebtoken");

module.exports.GenerateUserToken = (res, ID, next) => {
  const maxAge = 9 * 24 * 60 * 60 * 1000;
  const token = jwt.sign({ ID }, process.env.SECRET_KEY, { expiresIn: maxAge });

  res.cookie(process.env.USER_TOKEN, token, {
   // withCredentials: true,
    domain:".questhub-ek4w.vercel.app",
    path:"/",
    maxAge: maxAge,
    httpOnly: true,
    //secure: true,
    sameSite: "lax",
  });
};
