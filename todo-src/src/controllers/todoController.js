import ToDoData from '../models/todoModel.js'
import { errorLog } from '../utils/constants.js'

export const addTODO = async (req, res) => {
	const newTodo = new ToDoData({
		todo: req.body.todo,
		isCompleted: req.body.isCompleted,
		createdBy: req.session.user._id,
	})

	try {
		await newTodo.save()
		return res.status(200).send({ newTodo })
	} catch (err) {
		errorLog(err)
		return res.status(500).send({ message: 'Something went wrong' })
	}
}

export const getTODO = async (req, res) => {
	try {
		const todos = await ToDoData.find({ createdBy: req.session.user._id })
		return res.status(200).send({ todos })
	} catch (err) {
		errorLog(err)
		return res.status(500).send({ message: 'Something went wrong' })
	}
}

export const updateTODO = async (req, res) => {
	try {
		const updatedTodo = await ToDoData.findByIdAndUpdate(req.params.id, { todo: req.body.todo })
		return res.status(200).send({ updatedTodo })
	} catch (err) {
		errorLog(err)
		return res.status(500).send({ message: 'Something went wrong' })
	}
}

export const deleteTODO = async (req, res) => {
	try {
		const deletedTodo = await ToDoData.findByIdAndDelete(req.params.id)
		return res.status(200).send({ deletedTodo })
	} catch (err) {
		errorLog(err)
		return res.status(500).send({ message: 'Something went wrong' })
	}
}

export const deleteAllTODO = async (req, res) => {
	try {
		const deletedAllTodo = await ToDoData.deleteMany({ createdBy: req.session.user._id })
		return res.status(200).send({ deletedAllTodo })
	} catch (err) {
		errorLog(err)
		return res.status(500).send({ message: 'Something went wrong' })
	}
}
