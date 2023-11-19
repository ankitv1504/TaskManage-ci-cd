import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
	{
		todo: {
			type: String,
			required: true,
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
)

todoSchema.virtual('id').get(function () {
	return this._id.toHexString()
})

todoSchema.set('toJSON', {
	virtuals: true,
})

export default mongoose.model('TODO', todoSchema)
