const jwt = require("jsonwebtoken");

module.exports.GenerateUserToken = (res, ID, next) => {
  const maxAge = 9 * 24 * 60 * 60 * 1000;
  const token = jwt.sign({ ID }, process.env.SECRET_KEY, { expiresIn: maxAge });

  console.log(token);

  res.cookie(process.env.USER_TOKEN, token, {
    withCredentials: true,
    maxAge: maxAge,
    secure: true,
    httpOnly: true,
    path: "/",
    domain: "https://questhub-ten.vercel.app", // or your domain name (e.g., 'example.com')
    sameSite: "strict", // or 'lax' depending on your needs
  });
};
