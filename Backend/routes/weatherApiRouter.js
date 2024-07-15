import express from "express";

const weatherApiRouter = express.Router();

weatherApiRouter.get("/", (req, res) => {
  const weatherApiKey = process.env.WeatherApiKey;
  res.send(weatherApiKey);
});

export default weatherApiRouter;
