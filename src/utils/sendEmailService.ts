import {createTransport} from "nodemailer";
import {config} from 'dotenv'

config()

const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
})

export const sendEmailService = {
    async sendEmail(email: string, subject: string, message: string): Promise<void> {
        try {
            await transporter.sendMail({
                from: 'Dzmitry Yesis',
                to: email,
                subject: subject,
                html: message,
            })
        } catch (error) {
            console.log('Error sending email: ', error)
        }
    }
}