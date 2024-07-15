import mongoose from "mongoose";
import User from "./User.js";

const { Schema, model } = mongoose;
const timestamps = true;
const required = true;
const unique = true;
const trim = true;

const clothSchema = new mongoose.Schema(
  {
    user:     { type: Schema.Types.ObjectId, ref: "user" },
    image:    { type: String },
    favorite: { type: Boolean, default: false },
    type:     { type: String, enum: ["top", "bottom", "full"] },
    color:    { type: String },
    // season:     { type: String, enum: ["summer", "winter", "in-between"], required},
    season:   { type: [String], required },
    style:    { type: String, enum: ["casual","formal","work","sports","night-out","lounge-wear","rainy",] },
  },
  { timestamps }
);

clothSchema.pre("remove", async function () {
  const id = this._id.toString();
  console.log("Cloth is being removed " + id);

  const user = await User.findById(this.user);

  if (user) {
    user.clothes = user.clothes.filter((x) => x.toString() != id);
    await user.save();
  }
});

const Cloth = model("cloth", clothSchema);
export default Cloth;
