import Users from "./../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) res.sendStatus(401);
    const user = await Users.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!user[0]) res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) res.sendStatus(403);
        const { id, name, email } = user[0];
        const accessToken = jwt.sign(
          { id, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};
