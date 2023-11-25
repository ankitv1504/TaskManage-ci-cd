import mongoose from 'mongoose'
import ToDoData from '../models/todoModel.js'
import { LIMIT, errorLog, successLog } from '../utils/constants.js'

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

export const getPagedTODO = async (req, res) => {
	try {
		// const todos = await ToDoData.find({ createdBy: req.session.user._id })

		const todos = await ToDoData.aggregate([
			{
				$match: {
					createdBy: new mongoose.Types.ObjectId(req.session.user._id),
				},
			},
			{
				$facet: {
					data: [
						{
							$sort: {
								createdAt: -1,
							},
						},
						{ $skip: parseInt(req.query.skip) },
						{ $limit: parseInt(req.query.limit ?? LIMIT) },
					],
				},
			},
		])
		return res.status(200).send(todos[0].data)
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
