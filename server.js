import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Create transporter (email sender)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to send email
app.post("/send-email", async (req, res) => {
  const { name, email, phone, address, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: `"Best Solar Quote" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL, // 📥 your receiver email
    subject: `Solar Quote Request from ${name}`,
    html: `
      <h2>New Solar Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New Team Join Request",
    text: `Name: ${name}\nEmail: ${email}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log("🚀 Notification server running on port 4000");
});

