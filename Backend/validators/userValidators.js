import { body } from "express-validator";

const userValidators = [
  body("username")
    .isWhitelisted("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.")
    .withMessage("username-invalid"),
  body("email")
      .isEmail()
      .withMessage("email-invalid"),
  body("password")
      .isLength({ min: 6 })
      .withMessage("password-too-short"),
  body("password")
      .isLength({ max: 20 })
      .withMessage("password-too-long"),
  //body("password").isStrongPassword().withMessage("password-too-weak"),
];

export default userValidators;