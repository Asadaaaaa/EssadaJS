// Library
import { createTransport } from 'nodemailer';

class MailHelper {
  constructor(server) {
    this.server = server;
  }

  /**
   * Sends an email using the specified parameters.
   *
   * @param {string} toEmail - The recipient's email address.
   * @param {string} subject - The subject of the email.
   * @param {Object} content - The content of the email.
   * @param {string} [content.text] - The plain text content of the email.
   * @param {string} [content.html] - The HTML content of the email.
   * @returns {number|undefined} Returns -1 if the content is invalid or if there is an error sending the email.
  */
  sendEmail(toEmail, subject, content) {
    if(!content.text && !content.html) return -1;
    
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: this.server.env.MAIL_EMAIL,
        pass: this.server.env.MAIL_ETHEREAL_PASSWORD,
      },
    });
    
    transporter.sendMail({
      from: `"${ this.server.env.APP_NAME }" <${ this.server.env.MAIL_EMAIL }>`,
      to: toEmail,
      subject,
      ...( content.html ? {
        html: content.html
      } : {
        text: content.text
      })
    }, (error, info) => {
      if (error) {
        this.server.sendLogs('Error: ');
        console.log(error);
        return -1;
      }
      
      this.server.sendLogs(`Email sent: ${info.response}`); 
    });
    
    return;
  }
}

export default MailHelper;