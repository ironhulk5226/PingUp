import nodemailer from "nodemailer";
// steps :
// Create a transporter. Use SMTP or another supported transport.
// Compose a message. Define sender, recipient(s), subject, and content.
// Send it with transporter.sendMail().

// Create a transporter object using the SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS,
  },
});

// 1. host: ""
// The SMTP server address (like the "post office" for emails).
// Example:
// Gmail → "smtp.gmail.com"
// Outlook → "smtp.office365.com"
// Yahoo → "smtp.mail.yahoo.com"
// Custom → "mail.yourdomain.com"

// 2. port: 587
// The port number the SMTP server listens on.
// Common ones:
// 587 → TLS (recommended, most common)
// 465 → SSL (old, but still used)
// 25 → Default SMTP (often blocked by ISPs for spam reasons)
// So 587 means you’re using a secure connection with STARTTLS (good choice ✅).

// 3. auth: { user, pass }
// These are your login credentials for the SMTP server.
// user: usually your email address (e.g., "youremail@gmail.com")
// pass: either your email password or an app password (for Gmail/Outlook, you need an app-specific password because they block less secure logins).

const sendMail = async ({to,subject,body}) =>{
    const response = transporter.sendMail({
        from:process.env.SENDER_EMAIL,
        to,
        subject,
        html:body
    })
    return response
}

export default sendMail;