import express from "express"
import { isAdmin } from "../MW/MW.Staff.Alaa.js"
import { add_review} from "../Controllers/Review.Controller.js"
import { post_validator, rating_validator } from "../Validators/Validators.Alaa.js"
import ValResultHandler from "../Validators/ValidatorsResultHandler.js"



const review_router = express.Router()


review_router.route('/add_review/:id').post(rating_validator, post_validator, ValResultHandler, add_review)

export default review_router