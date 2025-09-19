const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP email
  async sendOTPEmail(email, otp, firstName) {
    try {
      // In development mode, just log the OTP instead of sending email
      if (process.env.NODE_ENV === 'development') {
        console.log(`
🔔 DEVELOPMENT MODE - OTP EMAIL
📧 To: ${email}
👤 Name: ${firstName}
🔐 OTP: ${otp}
⏰ Expires: 10 minutes
        `);
        return { success: true, messageId: 'dev-mode-' + Date.now() };
      }

      const mailOptions = {
        from: `"TickerTracker" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Email - TickerTracker Registration',
        html: this.getOTPEmailTemplate(otp, firstName),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error);
      
      // In development, still return success to allow testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔔 Development mode: Simulating email send success');
        return { success: true, messageId: 'dev-fallback-' + Date.now() };
      }
      
      return { success: false, error: error.message };
    }
  }

  // Email template for OTP
  getOTPEmailTemplate(otp, firstName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; border: 2px dashed #667eea; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 TickerTracker</h1>
                <p>Welcome to Your Stock Market Journey!</p>
            </div>
            <div class="content">
                <h2>Hello ${firstName}! 👋</h2>
                <p>Thank you for registering with TickerTracker. To complete your registration and verify your email address, please use the OTP code below:</p>
                
                <div class="otp-box">
                    <p><strong>Your Verification Code:</strong></p>
                    <div class="otp-code">${otp}</div>
                    <p><small>This code will expire in 10 minutes</small></p>
                </div>

                <p><strong>Instructions:</strong></p>
                <ul>
                    <li>Enter this OTP code in the verification form</li>
                    <li>The code is valid for 10 minutes only</li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>

                <p>Once verified, you'll have access to:</p>
                <ul>
                    <li>📈 Real-time stock market data</li>
                    <li>📊 Portfolio tracking</li>
                    <li>🔔 Price alerts and notifications</li>
                    <li>📰 Market news and insights</li>
                </ul>

                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2025 TickerTracker. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Send welcome email after successful verification
  async sendWelcomeEmail(email, firstName) {
    try {
      const mailOptions = {
        from: `"TickerTracker" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Welcome to TickerTracker! 🎉',
        html: this.getWelcomeEmailTemplate(firstName),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Welcome email template
  getWelcomeEmailTemplate(firstName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature-box { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to TickerTracker!</h1>
                <p>Your account has been successfully verified</p>
            </div>
            <div class="content">
                <h2>Hello ${firstName}! 👋</h2>
                <p>Congratulations! Your email has been verified and your TickerTracker account is now active.</p>

                <div class="feature-box">
                    <h3>📈 Track Stocks</h3>
                    <p>Monitor your favorite stocks with real-time data and charts</p>
                </div>

                <div class="feature-box">
                    <h3>💼 Manage Portfolio</h3>
                    <p>Create and track multiple portfolios to organize your investments</p>
                </div>

                <div class="feature-box">
                    <h3>🔔 Get Alerts</h3>
                    <p>Set price alerts and receive notifications for important market movements</p>
                </div>

                <div class="feature-box">
                    <h3>📊 Market Insights</h3>
                    <p>Access market news, analysis, and insights to make informed decisions</p>
                </div>

                <p style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Start Trading 🚀</a>
                </p>

                <div class="footer">
                    <p>Happy Trading!</p>
                    <p>&copy; 2025 TickerTracker. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();