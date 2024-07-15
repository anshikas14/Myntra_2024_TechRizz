import express from "express";
import cors from "cors";
import { connect } from "./libs/database.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import uploadRouter from "./routes/uploadRouter.js";
import clothesRouter from "./routes/clothesRouter.js";
import weatherApiRouter from "./routes/weatherApiRouter.js";
import dotenv from "dotenv"
import bodyParser from "body-parser"
import userRouter from "./routes/userRouter.js";
import checkToken from "./middlewares/checkToken.js";
import googleSigninRouter from "./routes/googleSigninRouter.js";

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    extended: true,
    limit: "50mb",
  })
);
dotenv.config();
// Connection 
await connect();
// Request logger
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
// Routes with middleware
app.use("/cloth", checkToken, clothesRouter)
app.use("/upload", checkToken, uploadRouter)
app.use("/weatherApiKey", weatherApiRouter)
app.use("/users", userRouter)
app.use("/googleSignin", googleSigninRouter)

// global error handler middleware
app.use(globalErrorHandler);
// listening
const port = process.env.PORT || 3099;
app.listen(port, "0.0.0.0", () => {
  console.log(`Let the adventures in Backend begin at port:${port}!!🙈`);
});
