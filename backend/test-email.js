const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  const testEmails = [
    'madsbt93@hotmail.dk',
    'fadimiluyi@gmx.ch', 
    'abiolaadegbite1@gmail.com',
    'fadimiluyi@icloud.com'
  ];

  console.log('Testing email sending...');
  console.log('API Key exists:', !!process.env.RESEND_API_KEY);
  console.log('From email:', process.env.FROM_EMAIL);

  for (const email of testEmails) {
    try {
      console.log(`\nTesting email to: ${email}`);
      
      const result = await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Synqit <noreply@notifications.pactfindr.io>',
        to: email,
        subject: 'Test Email - Synqit Verification',
        html: `
          <h1>Test Email</h1>
          <p>This is a test email to verify that email delivery is working for ${email}</p>
          <p>If you receive this, the email service is functioning correctly.</p>
        `
      });

      console.log(`✅ Success for ${email}:`, result);
    } catch (error) {
      console.log(`❌ Error for ${email}:`, error);
    }
  }
}

testEmail().catch(console.error);