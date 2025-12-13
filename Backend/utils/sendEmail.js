const Brevo = require('@getbrevo/brevo');

module.exports = async function sendEmail(to, subject, resetUrl) {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.authentications['apiKey'].apiKey =
        process.env.BREVO_API_KEY;

    const email = {
        sender: {
            email: "tarunachoudhary43@gmail.com",
            name: "Auth System"
        },
        to: [{ email: to }],
        subject,

        htmlContent: `
            <h2>Password Reset</h2>
            <p>Click below to reset your password:</p>

            <p>
              <a href="${resetUrl}">
                ${resetUrl}
              </a>
            </p>

            <p>This link expires in 15 minutes.</p>
        `,

        // FORCE disable tracking
        tracking: {
            click: false,
            open: false
        }
    };

    await apiInstance.sendTransacEmail(email);
};
