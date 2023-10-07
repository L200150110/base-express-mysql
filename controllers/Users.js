import Users from "./../models/UserModel.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
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
      const users = await Users.create({
        name,
        email,
        password: hashedPassword,
      });
      res.json({ message: "create success" });
    } catch (err) {
      console.log(err);
      res.json(err.message);
    }
  }
};
