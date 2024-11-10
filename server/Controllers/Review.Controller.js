import { Booking } from "../Models/Booking.Model.js";
import { Review } from "../Models/Review.Model.js";







export const add_review=async (req,res,next)=>{
    try {
        const {rating, post,reservation_code}=req.body
        const bookingID=req.params.id
    const booking= await Booking.findById(bookingID)
    if(booking.reservation_code!==reservation_code){
        res
        .status(401)
        .json({msg:"The reservation code you have provided doesn't match our database, please check your entry and try again", booking})
    } else if(booking.status==="pending" || booking.status==="canceled"){
        res
        .status(401)
        .json({msg:"We can't accept your post, you either didn't check in yet, or canceled your booking. For more information contact our support team", booking})
    } else if(booking.status==="checked in"){
        const new_post= await Review.create({
            booking_ref:booking,
            rating:rating,
            post: post
        })
        res
        .status(201)
        .json({msg:"welcome", new_post})
    }
    } catch (error) {
        next(error)
    }
    }