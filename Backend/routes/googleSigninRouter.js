import express from "express";

const googleSigninRouter = express.Router();

googleSigninRouter.get("/", (req, res) => {
  try{
    // console.log("googleSigninRouter");
    const expoClientId = process.env.EXPO_CLIENT_ID;
    // console.log("expoClientId", expoClientId);
    res.send({
      expoClientId: expoClientId,
      iosClientId: process.env.IOS_CLIENT_ID,
      androidClientId: process.env.ANDROID_CLIENT_ID,
    });
  } catch (error){
    console.log("error in googleSigninRouter", error);
  }
});

export default googleSigninRouter;