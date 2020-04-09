const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const adminEmailAccount = process.env.ADMIN_EMAIL;

const sendPasswordResetEmail = async (email, resetToken) => {
	const resetLink = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
	const msg = {
		to: email,
		from: `Ranker App <${adminEmailAccount}>`,
		subject: 'Ranker App - Reset Password Link',
		html: `A password reset request was made for Ranker App account. <a href=${resetLink}>Click here to reset your password.</a>`
	};

	try {
		await sgMail.send(msg);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	sendPasswordResetEmail
};
