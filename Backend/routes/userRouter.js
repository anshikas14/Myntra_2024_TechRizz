import express from "express";
import createError from "http-errors";
import User from "../models/User.js";
import { hash } from "bcrypt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userValidators from "../validators/userValidators.js";
import { validationResult } from "express-validator";

const userRouter = express.Router();

userRouter
  .get("/", async (req, res, next) => {
    try {
      const users = await User.find({});
      res.send({ users });
    } catch (error) {
      next(createError(400, error.message));
    }
  })

  // registration
  .post("/signup", userValidators, async (req, res, next) => {
    try {
      const valResult = validationResult(req);
    //   console.log("valResult", valResult);
      if (!valResult.isEmpty()) {
        next({ message: valResult.errors.map((err) => err.msg), status: 400 });
        return;
      }

      req.body.password = await hash(req.body.password, 10);
      const user = await User.create(req.body);

      // * create token
      const payload = { userId: user._id };
      const options = { expiresIn: "300m" };
      const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    //   console.log("token", token);

      // ? Question: why do we need spread operator? why to json?
      // * It is a BSON so we turn it to JSON
      res.send({ ...user.toJSON(), token });
      console.log("registration successful");
    } catch (error) {
      next(createError(400, error.message));
    }
  })

  // login
  .post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    // console.log("email from login:", email);
    // console.log("password from login:", password);
    try {
      const findUserWithSameEmail = await User.findOne({ email });
      if (!findUserWithSameEmail) {
        next(createError(400, "The email does not exist!"));
        return;
      }
      const success = await bcrypt.compare(
        password,
        findUserWithSameEmail.password
      );
        //   console.log("success: ", success);
      if (!success) {
        return next(createError(400, "Wrong password, please try again"));
      }
        //   console.log("hash:", findUserWithSameEmail.password);

      // TODO: make the token expire after 5min and then resend one automatically.
      // * create token
      const payload = { userId: findUserWithSameEmail._id };
      const options = { expiresIn: "300m" };
      const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    //   console.log("token", token);
      console.log("user object in login", findUserWithSameEmail);
      // ? Question: why do we need spread operator? why to json?
      // * It is a BSON so we turn it to JSON
      res.send({ ...findUserWithSameEmail.toJSON(), token });
      console.log("login successful");
    } catch (error) {
      next(createError(400, "login failed, please try again"));
      console.log(error);
    }
  })

    .put("/:id", async (req, res, next) =>{
      console.log(req.body);
        try {
            const id = req.params.id
            console.log(req.body);
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
            res.send(user)
        } catch (error){
            next(createError(400, error.message))
        }
    })
    
  // delete user
  .delete("/:id", async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      await user.remove();
      res.send({ ok: true, deleted: user });
    } catch (error) {
      next(createError(400, error.message));
    }
  });

export default userRouter;
