const router = require("express").Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

router.post("/register", async (req, res) => {
  const { name, email, phone, password, isStudent } = req.body;
  const hashedPassword = CryptoJs.AES.encrypt(
    password,
    process.env.PASS_SEC
  ).toString();
  const newUser = isStudent
    ? new Student({ name, email, phone, password: hashedPassword })
    : new Teacher({ name, email, phone, password: hashedPassword });

  try {
    const savedUser = await newUser.save();

    //Saved user not send by server due to security reasons.
    res.status(200).json(`${name} is Succesfully registered.`);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  const { name, email, password, isStudent } = req.body;
  try {
    const user = isStudent
      ? await Student.findOne({ email })
      : await Teacher.findOne({ email });
    if (!user) return res.status(401).json("Wrong Credentials!");

    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

    originalPassword !== password && res.status(401).json("Wrong Credentials!");

    const { password: pass, ...rest } = user._doc;

    const token = jwt.sign(rest, process.env.JWT_SEC, { expiresIn: "1d" });

    res.status(200).json(token);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
