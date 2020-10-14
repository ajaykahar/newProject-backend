const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const employeeSchema = new Schema({
	employeeId: {
		type: String,
		default: '',
		index: true,
		unique: true
	},
	name: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	role:{
		type:String,
		default:"Employee",
	}
});


employeeSchema.pre('save', function (next) {
	const user = this;

	bcrypt.genSalt(10, function (err, salt) {
		if (err) { return next(err); }

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	})
});

employeeSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) { 
			return callback(err); }
		callback(null, isMatch);
	});
}

const ModelClass = mongoose.model('Employee', employeeSchema);

module.exports = ModelClass;