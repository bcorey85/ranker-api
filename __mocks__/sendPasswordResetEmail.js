const adminEmailAccount = 'ranker.bc@gmail.com';

const sendPasswordResetEmail = jest
	.fn()
	.mockImplementation((email, resetLink) => {
		return (resetMsg = {
			to: email,
			from: `Ranker App <${adminEmailAccount}>`,
			subject: 'Ranker App - Reset Password Link',
			html: `A password reset request was made for Ranker App account. <a href=${resetLink}>Click here to reset your password.</a>`
		});
	});

module.exports = { sendPasswordResetEmail };
