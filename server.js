import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to send email
app.post("/send-email", async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    zipcode,
    state,
    propertyType,
    energyBill,
    timeframe,
    message,
  } = req.body;

  const mailOptions = {
    from: `"Best Solar Quote" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL, // your receiving inbox
    subject: `Solar Quote Request from ${name}`,
    html: `
      <h2>New Solar Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Zipcode:</strong> ${zipcode}</p>
      <p><strong>Property Type:</strong> ${propertyType}</p>
      <p><strong>Energy Bill:</strong> ${energyBill}</p>
      <p><strong>Installation Timeframe:</strong> ${timeframe}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// For Railway Port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
