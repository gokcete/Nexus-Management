import { validationResult } from "express-validator";



// this function can handle all the validators and sanitizers:

const ValResultHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};


export default ValResultHandler