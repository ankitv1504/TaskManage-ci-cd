import validator from 'validator'
export const validateSignup = (req, res, next) => {
	const { name, email, username, phone, password } = req.body
	if (!name || !email || !username || !password) {
		return res.status(400).send({ message: 'All fields are mandatory.' })
	}
	if (name.length < 3 || name.length > 25) {
		return res.status(400).send({ message: 'Name must be between 3 and 25 characters.' })
	}
	if (!validator.isEmail(email)) {
		return res.status(400).send({ message: 'Invalid email address.' })
	}
	if (username.length < 3 || username.length > 25) {
		return res.status(400).send({ message: 'Username must be between 3 and 25 characters.' })
	}
	if (phone && !validator.isMobilePhone(phone)) {
		return res.status(400).send({ message: 'Invalid phone number.' })
	}
	if (password.length < 6 || password.length > 16) {
		return res.status(400).send({ message: 'Password must be at least 6 - 16 characters long.' })
	}
	next()
}

export const validateSignin = (req, res, next) => {
	const { emailuname, password } = req.body
	if (!emailuname || !password) {
		return res.status(400).send({ message: 'All fields are mandatory.' })
	}
	if (!validator.isEmail(emailuname) && (emailuname.length < 3 || emailuname.length > 25)) {
		return res.status(400).send({ message: 'Invalid username.' })
	}
	if (password.length < 6 || password.length > 16) {
		return res.status(400).send({ message: 'Password must be at least 6 - 16 characters long.' })
	}
	next()
}
