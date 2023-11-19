import userData from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from '../utils/constants.js'
import validator from 'validator'
import mongoose from 'mongoose'

export const signup = async (req, res) => {
	const { name, username, email, phone, password } = req.body
	// check if user exists
	const emailExists = await userData.findOne({ email }).exec()
	if (emailExists) {
		return res.status(400).send({ message: 'User already exists with this email. Try another email or login.' })
	}
	const usernameExists = await userData.findOne({ username }).exec()
	if (usernameExists) {
		return res.status(400).send({ message: 'User already exists with this username. Try another username.' })
	}

	const hashedPass = await bcrypt.hashSync(password, SALT_ROUNDS)

	const user = new userData({ name, username, email, phone, password: hashedPass })

	// save user
	try {
		await user.save()
		return res.status(201).redirect('/signin')
		// return res.status(201).send({ message: 'User created successfully', user })
	} catch (error) {
		return res.status(400).send({ message: 'User not created', error })
	}
}

export const signin = async (req, res) => {
	const { emailuname, password } = req.body
	// check if user exists
	let foundUser
	if (validator.isEmail(emailuname)) {
		foundUser = await userData.findOne({ email: emailuname }).exec()
	} else {
		foundUser = await userData.findOne({ username: emailuname }).exec()
	}
	if (!foundUser) {
		return res.status(400).send({ message: 'User not found' })
	} else {
		// check password
		const isMatch = await bcrypt.compareSync(password, foundUser.password)
		if (!isMatch) {
			return res.status(400).send({ message: 'Invalid credentials' })
		}
		// set session
		req.session.isAuthenticated = true
		req.session.user = foundUser
		// return res.status(200).send({ message: 'Logged in successfully', user: foundUser })
		return res.status(200).redirect('/')
	}
}

export const signout = async (req, res) => {
	//destroy the session
	req.session.destroy()
	return res.status(200).redirect('/signin')
}

export const removeAllsessions = async (req, res) => {
	//create the session schema
	const sessionSchema = new mongoose.Schema({ _id: String }, { strict: false })
	const sessionModel = mongoose.model('session', sessionSchema)

	//get the user data who is making the request
	const username = req.session.user.username

	//delete the sessions from db
	try {
		const deleteDb = await sessionModel.deleteMany({
			'session.user.username': username,
		})
		console.log(deleteDb)
		return res.redirect('/signin')
	} catch (error) {
		return res.send({
			status: 500,
			message: 'signout unsuccessfull',
			error: error,
		})
	}
}
