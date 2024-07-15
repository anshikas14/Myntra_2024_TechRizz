import mongoose from 'mongoose'
import Cloth from './Cloth.js'

const { Schema, model } = mongoose
const timestamps = true
const required = true
const unique = true
const trim = true

const userSchema = new mongoose.Schema({

    username:     { type: String,  trim },
    email:        { type: String,  trim, unique },
    password:     { type: String, required },
    clothes:      { type: [Schema.Types.ObjectId], ref: 'cloth'  },
    profileImage: {type: String, default: "Abc.png"}
    
}, {timestamps})

// Example of controlling how a MongoDB BSON Document gets converted to JSON
userSchema.options.toJSON = {
    transform: function(document, documentAsJSON, options) {
        delete documentAsJSON.__v
        delete documentAsJSON.password
        return documentAsJSON
    }
}

userSchema.pre("remove", async function(){
    console.log("User is being removed " + this._id)
    await Cloth.deleteMany({ user: this._id })

})


const User = model("user", userSchema)
export default User


// clothes:      { type: [Schema.Types.ObjectId], ref: "cloth" },