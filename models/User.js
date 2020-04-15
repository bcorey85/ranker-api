const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const categorySchema = new mongoose.Schema({
	category: {
		type: String
	}
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [ true, 'Please enter a username' ],
		unique: true,
		index: true,
		trim: true
	},
	email: {
		type: String,
		required: [ true, 'Please enter a valid email.' ],
		unique: true,
		index: true,
		trim: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please enter a valid email.'
		]
	},
	password: {
		type: String,
		required: [
			true,
			'Please enter a password with at least 6 characters.'
		],
		trim: true,
		minlength: [ 6, 'Please enter a password with at least 6 characters.' ],
		select: false
	},
	categories: [ categorySchema ],
	rankForms: [ { type: mongoose.Types.ObjectId, ref: 'RankForm' } ],
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

userSchema.methods.generateAuthToken = async function() {
	const user = this;

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '2hr'
	});

	return token;
};

userSchema.statics.login = async function(email, password) {
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return undefined;
	}

	const passMatch = await bcrypt.compare(password, user.password);

	if (!passMatch) {
		return undefined;
	}

	user.token = await user.generateAuthToken();

	return user;
};

// Hash user password before save
userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		try {
			const hashed = await bcrypt.hash(user.password, 10);
			user.password = hashed;
		} catch (error) {
			console.log(error);
		}
	}

	next();
});

userSchema.methods.generateResetPasswordToken = function() {
	// Gen random 32 byte Buffer and change to hexidecimal
	const resetToken = crypto.randomBytes(32).toString('hex');

	//Set engrypted resetToken on user model
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	// 10 minutes
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
