import nodemailer from 'nodemailer'
import { cancel_conformation, conformation_email_gen } from './emails_generator.js'

export const email_sender= async(booking, status)=>{
    try {
        let transporter= nodemailer.createTransport({
            host: process.env.HOST,
            port:process.env.E_PORT,
            secure: true,
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })

        if (status==="confirm"){

            const info= await transporter.sendMail({
                from: process.env.EMAIL,
                to:booking.guest_info.guest_email,
                subject: "Booking Conformation",
                html:conformation_email_gen(booking)
            })
        } else if(status==="cancel"){
            const info= await transporter.sendMail({
                from: process.env.EMAIL,
                to:booking.guest_info.guest_email,
                subject: "cancel Conformation",
                html: cancel_conformation(booking)
             })
        }
        
    } catch (error) {
        console.error(error);
    }
}