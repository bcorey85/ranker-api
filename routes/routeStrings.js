const authRoute = {
	register: '/auth/register',
	login: '/auth/login',
	forgotPassword: '/auth/forgotpassword',
	resetPassword: '/auth/resetpassword/:resetToken',
	resetPasswordRoot: '/auth/resetpassword'
};

const rankRoute = {
	root: '/rank',
	rankFormId: '/rank/:rankFormId',
	rankFormIdRoot: '/rank'
};

const userRoute = {
	userId: '/users/:userId',
	userIdRoot: '/users'
};

module.exports = { authRoute, rankRoute, userRoute };
