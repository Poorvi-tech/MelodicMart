const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send contact form email to admin
exports.sendContactEmail = async (data) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Contact Details:</h2>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #555; line-height: 1.6;">${data.message}</p>
          </div>
        </div>
        
        <div style="background: #333; padding: 15px; text-align: center; color: white;">
          <p style="margin: 0;">Music Haven - Your Musical Instruments Store</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send confirmation email to customer
exports.sendConfirmationEmail = async (customerEmail, customerName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: 'Thank you for contacting Music Haven!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thank You for Reaching Out!</h1>
        </div>
        
        <div style="padding: 40px; background: #f9f9f9;">
          <h2 style="color: #333;">Dear ${customerName},</h2>
          
          <p style="color: #555; line-height: 1.8; font-size: 16px;">
            We have received your message and appreciate you contacting us. 
            Our team will review your inquiry and get back to you within 24 hours.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">What's Next?</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Our team will review your message</li>
              <li>You'll receive a response within 24 hours</li>
              <li>We'll answer all your questions</li>
            </ul>
          </div>
          
          <p style="color: #555; line-height: 1.8;">
            In the meantime, feel free to browse our collection of premium musical instruments.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      display: inline-block;
                      font-weight: bold;">
              Browse Our Store
            </a>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 5px 0;">Music Haven</p>
          <p style="margin: 5px 0; font-size: 14px;">Your Musical Instruments Store</p>
          <p style="margin: 5px 0; font-size: 12px; color: #999;">
            Email: ${process.env.EMAIL_USER} | Phone: +91 9074554804
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send reply email to customer
exports.sendReplyEmail = async (customerEmail, customerName, replyMessage, originalSubject) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Re: ${originalSubject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Response to Your Inquiry</h1>
        </div>
        
        <div style="padding: 40px; background: #f9f9f9;">
          <h2 style="color: #333;">Dear ${customerName},</h2>
          
          <p style="color: #555; line-height: 1.8; font-size: 16px;">
            Thank you for contacting Music Haven. Here is our response to your inquiry:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="color: #555; line-height: 1.6;">${replyMessage}</p>
          </div>
          
          <p style="color: #555; line-height: 1.8;">
            If you have any further questions, please don't hesitate to reach out to us again.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Contact Information</h3>
            <p style="color: #555; margin: 5px 0;">
              <strong>Email:</strong> ${process.env.EMAIL_USER}
            </p>
            <p style="color: #555; margin: 5px 0;">
              <strong>Phone:</strong> +91 9074554804
            </p>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: white;">
          <p style="margin: 5px 0;">Music Haven</p>
          <p style="margin: 5px 0; font-size: 14px;">Your Musical Instruments Store</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};