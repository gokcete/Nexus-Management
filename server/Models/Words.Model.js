import mongoose, { Schema, model } from "mongoose";

const wordSchema=new Schema({
    prohibitedWords:[String]
}, {id:false})

export const Word=model("Word", wordSchema)