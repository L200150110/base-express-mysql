import Users from "./../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};

export const addUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword) {
    res.status(400).json({ message: "passwords do not match" });
  } else {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const exist = await Users.findAll({
        where: { email: req.body.email },
      });
      if (exist.length > 0) {
        res.status(400).json({ message: "email already exist" });
      } else {
        const user = await Users.create({
          name,
          email,
          password: hashedPassword,
        });
        res.json({ message: "create success", data: user });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
};

export const loginUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: { email: req.body.email },
    });
    const match = await bcrypt.compare(req.body.password, users[0].password);
    if (!match) res.status(400).json({ message: "wrong password" });
    else {
      const { id, name, email } = users[0];
      const accessToken = jwt.sign(
        { id, name, email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
      );
      const refreshToken = jwt.sign(
        { id, name, email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      await Users.update({ refresh_token: refreshToken }, { where: { id } });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // active for 24 hours
        // secure: true, // for https
      });
      res.json({ accessToken });
    }
  } catch (err) {
    res.status(404).json({ message: "email does not match" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) res.sendStatus(204);
    const user = await Users.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!user[0]) res.sendStatus(204);
    const { id } = user[0];
    await Users.update({ refresh_token: null }, { where: { id } });
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(403);
  }
};
