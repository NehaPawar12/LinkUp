import mongoose from "mongoose";

//Creating Schema
const userSchema = new mongoose.Schema(
    {
        //Putting in all the fields for the user 
        email: {
            type:String,
            required: true,
            unique: true,
        },

        fullName: {
            type :String,
            required : true,
        },

        password : {
            type : String,
            required: true,
            minlength: 6,
        },

        profilePic: {
            type: String,
            default: "",
        }
    },

    {timestamps: true}
)

const User = mongoose.model("User", userSchema)

export default User; //Exporting it as to use in other files.