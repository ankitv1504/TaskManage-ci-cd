import mongoose from 'mongoose'
import { successLog, errorLog, ulLog } from './constants.js'

mongoose.set('strictQuery', false)
const database = mongoose
	.connect(process.env.DB_URL, {
		dbName: 'todo',
		tlsInsecure: true,
		connectTimeoutMS: 10000,
	})
	.then(() => {
		successLog('Connected to MongoDB - ' + ulLog('TODO'))
	})
	.catch((error) => {
		errorLog('Connection to MongoDB failed!\n' + ulLog(error))
	})

export default database
