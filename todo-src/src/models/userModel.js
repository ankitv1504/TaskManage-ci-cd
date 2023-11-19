import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			match: /^[0-9]{10}$/,
		},
	},
	{ timestamps: true }
)

userSchema.virtual('id').get(function () {
	return this._id.toHexString()
})

userSchema.set('toJSON', {
	virtuals: true,
})

export default mongoose.model('User', userSchema)
