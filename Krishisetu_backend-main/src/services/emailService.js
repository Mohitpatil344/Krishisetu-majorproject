const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Gmail App Password
    }
  });
};

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Krishisetu',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Verify Your Email - Krishisetu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; margin: 0;">🌱 Krishisetu</h1>
            <p style="color: #6b7280; margin: 5px 0;">Agricultural Waste Management Platform</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #374151; margin-top: 0;">Email Verification</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Thank you for registering with Krishisetu! To complete your registration, 
              please use the following OTP to verify your email address:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #10b981; color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; font-size: 14px;">
              <strong>Important:</strong> This OTP will expire in 5 minutes. If you didn't request this verification, 
              please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Krishisetu. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name, role) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Krishisetu',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to Krishisetu!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; margin: 0;">🌱 Krishisetu</h1>
            <p style="color: #6b7280; margin: 5px 0;">Agricultural Waste Management Platform</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #374151; margin-top: 0;">Welcome ${name}!</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Congratulations! Your account has been successfully created as a <strong>${role}</strong> on Krishisetu.
            </p>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;">
                <strong>What's next?</strong><br>
                You can now access your dashboard and start using our platform to manage agricultural waste efficiently.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/signin" 
                 style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Sign In to Your Account
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Krishisetu. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email as it's not critical
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail
};
