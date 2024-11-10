import mongoose, { Schema, model } from "mongoose";


const reviewSchema= new Schema(
    {
        booking_ref:{},
        rating:{type:Number, min:1, max:5, required:true, default:3},
        post: {type:String, required:true},
        approved:{type:Boolean, default:false}
    }
)


export const Review= model("Review", reviewSchema)