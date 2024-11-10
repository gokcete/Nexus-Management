import jwt from "jsonwebtoken";
import { promisify } from "util";


export const createToken = async (payload, secret, options) => {
    const asyncToken = promisify(jwt.sign);
    return await asyncToken(payload, secret, options);
  };
  
 export const verifyToken = async (token, secret) => {
    const asyncVerify = promisify(jwt.verify);
    return await asyncVerify(token, secret);
  };

  export const passwordCheck= async(user, password)=>{
    return await user.comparePass(password)
   }