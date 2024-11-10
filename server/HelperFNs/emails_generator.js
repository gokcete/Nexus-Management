export const conformation_email_gen=(booking)=>{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Booking Conformation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
        }
        h1 {
            color: #4CAF50;
        }
        .details {
            margin: 20px 0;
        }
        .details table {
            width: 100%;
            border-collapse: collapse;
        }
        .details th, .details td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- English Version -->
        <h1>Booking Confirmation</h1>
        <p>Dear ${booking.guest_info.guest_name},</p>
        <p>Thank you for booking with us! We are pleased to confirm your reservation at <strong>NEXUS</strong> Hotel. Below are the details of your stay:</p>
        <div class="details">
        <table>
        <tr>
        <th>Reservation code:</th>
        <td><strong>${booking.reservation_code}</strong></td>
        </tr>
        <tr>
        <th>Check-in Date:</th>
        <td>${booking.checkIn_date}</td>
        </tr>
        <tr>
        <th>Check-out Date:</th>
        <td>${booking.checkOut_date}</td>
        </tr>
        <tr>
        <th>Number of Guests:</th>
        <td>${booking.guests_quantity}</td>
        </tr>
        </table>
        </div>
        
        <p>If you have any questions or need to make changes to your booking, please feel free to contact us at : <a href="mailto:[nexus2024@mail.de]" style="color: #4caf50"
        >Email Support</a></p>
        <p>We look forward to welcoming you!</p>
        <p><strong>Please notice our check in/out timing: </strong></p>
     <div class="details">
        <table>
        <tr>
        <th>Check out time</th>
        <td>Until 12:00 am</td>
        </tr>
        <tr>
        <th>Check-in time</th>
        <td>Starting 03:00 pm</td>
        </tr>
        </table>
        </div>
        <br>
        <p>Best regards,<br><strong>NEXUS</strong> Team</p>


    <div class="footer">
        &copy; 2024 <strong>NEXUS</strong>. All rights reserved.
    </div>
</body>
</html>

    `
}

export const cancel_conformation=(booking)=>{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancellation Conformation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
        }
        h1 {
            color: #E74C3C;
        }
        .details {
            margin: 20px 0;
        }
        .details table {
            width: 100%;
            border-collapse: collapse;
        }
        .details th, .details td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <h1>Booking Cancellation Confirmation</h1>
        <p>Dear ${booking.guest_info.guest_name},</p>
        <p>We regret to inform you that your booking at <strong>NEXUS</strong> has been successfully cancelled. Below are the details of the cancelled booking:</p>
        
        <div class="details">
            <table>
                <tr>
                    <th>Reservation code:</th>
                    <td><strong>${booking.reservation_code}</strong></td>
                </tr>
                <tr>
                    <th>Check-in Date:</th>
                    <td>${booking.checkIn_date}</td>
                </tr>
                <tr>
                    <th>Check-out Date:</th>
                    <td>${booking.checkOut_date}</td>
                </tr>
                <tr>
                    <th>Number of Guests:</th>
                    <td>${booking.guests_quantity}</td>
                </tr>
            </table>
        </div>

        <p>If you have any questions or you didn't request this cancellation, please do not hesitate to contact us at : <a href="mailto:[nexus2024@mail.de]" style="color: #4caf50"
            >Email Support</a></p>
            <p>We will start the refund process as soon as we check your payment details, our accounting team will contact you per email for further steps.</p>
        <p>We hope to welcome you in <strong>NEXUS</strong>  in the near future!</p>

         <p>Best regards,<br><strong>NEXUS</strong> Team</p>


    <div class="footer">
        &copy; 2024 <strong>NEXUS</strong>. All rights reserved.
    </div>
</body>
</html>
    `
}