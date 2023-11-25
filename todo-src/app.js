import express from 'express'
import session from 'express-session'

import userRoutes from './src/routes/userRoutes.js'
import todoRoutes from './src/routes/todoRoutes.js'
import ConnectMongoDBSession from 'connect-mongodb-session'
import cors from 'cors'

const sessionStore = ConnectMongoDBSession(session)

const app = express()

app.use(cors())

const store = new sessionStore({
	uri: process.env.DB_URL,
	collection: 'sessions',
})

app.set('view engine', 'ejs')
app.use('/views', express.static('views'))
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.use(
	session({
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: false,
		store: store,
	})
)

// Routing

// ? Backend Routes
app.use('/test', (req, res) => {
	res.json({
		message: 'Hello World',
		...req.query,
	})
})
app.use('/api', userRoutes)
app.use('/api', todoRoutes)

//? Frontend Routes
app.get('/', (req, res) => {
	if (req.session.isAuthenticated) {
		res.render('home', req.query)
	} else res.redirect('/signin')
})
app.get('/signin', (req, res) => {
	res.render('signin')
})
app.get('/signup', (req, res) => {
	res.render('signup')
})

export default app
