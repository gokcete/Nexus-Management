import mongoose from "mongoose";


const connect2DB=()=>{
    mongoose.connect(process.env.DB_URI)

    mongoose.connection.on('connected',()=>{
        console.log('Connection to Data Base established successfully');
    })
    mongoose.connection.on('error',(error)=>{
        console.error(error.message);
    })
}

export default connect2DB