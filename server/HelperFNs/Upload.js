import express from "express";
import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import randomString from "random-string-gen";
import { Room } from "../Models/Room.Model.js";
import { isStaff, isSupervisor } from "../MW/MW.Staff.Alaa.js";
import { remove_unwanted_data } from "./Helper.Booking.js";
import { Staff } from "../Models/Staff.Model.js";

export const upload_router = express.Router();

upload_router.use(bodyParser.urlencoded({ extended: true }));

upload_router.post("/pic-upload/:id", isSupervisor, async (req, res, next) => {
  try {
    // Getting the room id and the pictures from the request
    const roomID = req.params.id;
    const pics = req.files.picture;
    // checking if one picture or multi
    if (!Array.isArray(pics)) {
      // in case of one file uploaded
      let tempPath = pics.tempFilePath;
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: "Nexus",
      });
      const room = await Room.findByIdAndUpdate(
        { _id: roomID },
        { $addToSet: { pictures: result.secure_url } },
        { new: true }
      );
      // deleting the temporary file
      fs.unlinkSync(pics.tempFilePath);

      res
        .status(200)
        .json({ msg: "The image uploaded successfully", room, result });
    } else {
      // in case of multi files uploaded

      let all_tempPath = [];
      let all_urls = [];
      // getting the temp files
      for (let i = 0; i < pics.length; i++) {
        all_tempPath.push(pics[i].tempFilePath);
      }
      // mapping and saving to cloudinary
      const to_upload = all_tempPath.map(async (path) => {
        const result = await cloudinary.uploader.upload(path, {
          folder: "Nexus",
        });
        return result;
      });
      // getting the results from the promises
      let all_results = await Promise.all(to_upload);
      // getting the secure urls from the final results
      for (let i = 0; i < all_results.length; i++) {
        all_urls.push(all_results[i].secure_url);
      }
      // adding the urls to the array in the targeted room
      const room = await Room.findByIdAndUpdate(
        { _id: roomID },
        { $addToSet: { pictures: all_urls } },
        { new: true }
      );

      // deleting the temporary files
      for (let i = 0; i < pics.length; i++) {
        fs.unlinkSync(pics[i].tempFilePath);
      }
      res.status(200).json({
        msg: "All images uploaded successfully",
        room,
        all_results,
      });
    }
  } catch (error) {
    next(error);
  }
});

export const delete_pics= express.Router()

// to delete pics you need to send an array of the secure urls to delete with the room id as params
delete_pics.delete("/pic-delete/:id", isSupervisor, async(req,res,next)=>{

  try {
    const roomID = req.params.id;
    const room= await Room.findById(roomID)
    const original_pics= room.pictures
    
    const {pictures}=req.body
   
    let public_ids= pictures.map((path)=>{
      return path.split('/').slice(-2).join('/').split('.')[0]
    })
   const to_delete= public_ids.map(async(id)=>{
    const result = await cloudinary.uploader.destroy(id)
    return result
   })
   const all_results= await Promise.all(to_delete)

   const new_pics=remove_unwanted_data(original_pics,pictures)
   room.pictures=new_pics
   await room.save()
   res.status(200)
   .json({msg:'Pictures removed successfully', room, all_results})
  } catch (error) {
    next(error)
  }
})

export const staff_pic_upload = express.Router();

staff_pic_upload.post("/pic-upload", isStaff, async (req, res, next) => {
  try {
    const pic = req.files.picture;
    
    let tempPath = pic.tempFilePath;
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "Nexus-Staff",
    });

    const staff = await Staff.findByIdAndUpdate(
      { _id: req.user.uid },
      { pic: result.secure_url },
      { new: true }
    );

    // deleting the temporary file
    fs.unlinkSync(pic.tempFilePath);

    res
      .status(200)
      .json({ msg: "The image uploaded successfully", staff, result });
  } catch (error) {
    next(error);
  }
});

export const staff_pic_delete = express.Router();

staff_pic_delete.delete("/pic-delete", isStaff, async (req, res, next) => {
  try {
    const pic = req.body.pic;
    const staff= await Staff.findById(req.user.uid)
    let public_id =pic.split("/").slice(-2).join("/").split(".")[0];
    const result = await cloudinary.uploader.destroy(public_id);
    staff.pic=""
    await staff.save()
    res
      .status(200)
      .json({ msg: "Picture removed successfully", staff, result })
    
  } catch (error) {
    next(error);
  }
});