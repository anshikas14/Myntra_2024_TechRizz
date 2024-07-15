import express from "express";
import colorConverter from "../middlewares/colorConverter.js";
import Cloth from "../models/Cloth.js";


const clothesRouter = express.Router();

// show all clothes of a particular user, with his user id. user/clothes --receive an array of clothes.  
// or should we bring to the user and the get request, 

// Search Endpoints

// GET: All Clothes
clothesRouter.get("/closet",async (req, res, next) => {
  // this is supposed to find all the clothes of a user.
  try {
    if (Object.keys(req.query).length === 0) {
        const clothes = await Cloth.find({user: req.userData.userId}); //we are sending all clothes from this user
        res.send(clothes.reverse());
    }else {
        if(req.query.color){
          const colorName = colorConverter(req.query.color)

          const cloth = await Cloth.find({...req.query, color: Object.values(colorName), user: req.userData.userId})
          // console.log(cloth);
          res.send(cloth)
        }

        else{
        const clothes = await Cloth.find({...req.query, user: req.userData.userId}); 
        res.send(clothes.reverse())
      }
    }
  } catch (error) {
      next({
        status: 401,
        message: error.message,
        originalError: error,
      });
  }
});

// GET: All Favorites
clothesRouter.get("/favorite", async (req, res, next) => {
  // this is supposed to find all the favorite clothes of a user.
  try {
    const clothes = await Cloth.find({ favorite: true, user: req.userData.userId }); 
    res.send(clothes.reverse());
  } catch (error) {
    next({
      status: 401,
      message: error.message,
      originalError: error,
    });
  }
});


// GET: All Clothes from Current Weather 
clothesRouter.get("/home", async (req, res, next) => {

  // console.log("req userdata is---",req.userData);


  const temperature = parseInt(req.query.temperature); //parsefloat later
  let season = "winter";
  // console.log(typeof temperature);

  if (temperature >= 24) {
    season = "summer";
  }
  if (temperature <= 23 && temperature >= 12) {
    season = "in-between";
  }

  try {
    const clothesAsPerWeather = await Cloth.find({ season, user: req.userData.userId }); 
    clothesAsPerWeather.reverse();
    res.send({ clothesAsPerWeather });
  } catch (error) {
    next({
      status: 401,
      message: error.message,
      originalError: error,
    });
  }
});

// PUT: Mark Your Cloth as Favorite Request
clothesRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const cloth = await Cloth.findById(id);
    cloth.favorite = req.body.favorite;
    cloth.save();

    res.send(cloth);
    if (!cloth) {
      return next({ status: 404, message: "not found" });
    }
  } catch (error) {
    next({ 
      status: 400, 
      message: error.message 
    });
  }
});

// DELETE: Remove Cloth
clothesRouter.delete("/closet/:id", async (req, res, next) => {
  try {
    const item = await Cloth.findById(req.params.id);
    if (!item) {
      return next(createError(404, "cloth not found"));
    }
    item.remove();
    res.send("cloth deleted, ok!")
  } catch (error) {
    next({ status: 400, message: error.message });
  }
});

clothesRouter.get("/favorite", async (req, res, next) => {
  // this is supposed to find all the favorite clothes of a user.
  try {
    const clothes = await Cloth.find(); //we are sending all clothes from this
    res.send(clothes.reverse());
  } catch (error) {
    next({
      status: 401,
      message: error.message,
      originalError: error,
    });
  }
});
clothesRouter.get("/home", async (req, res, next) => {
  // this is supposed to find all the clothes of a user.
  // console.log("season is------",req.body.season);
  // console.log("temperature from FE-----", req.query.temperature);
 
  const temperature = parseInt(req.query.temperature); //parsefloat later
  let season = {};
  console.log(typeof temperature);


  try {
    
    const clothesTopBox = await Cloth.find({ ...season,type: "top" }); //we are sending all clothes from this
    const clothesBottomBox = await Cloth.find({ ...season, type: "bottom" }); //we are sending all clothes from this
    const favorites = await Cloth.find({favorite:true})
    
    // console.log(clothesTopBox.reverse());
    // console.log(clothesBottomBox.reverse());
    res.send({ clothesTopBox, clothesBottomBox, favorites });
  } catch (error) {
    next({
      status: 401,
      message: error.message,
      originalError: error,
    });
  }
});





export default clothesRouter;
