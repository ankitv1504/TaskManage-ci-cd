import { Router } from 'express'
import { removeAllsessions, signin, signout, signup } from '../controllers/userController.js'
import { authValidate } from './../middlewares/validateAuth.js'
import { validateSignin, validateSignup } from '../middlewares/validataion.js'

const router = Router()

router.post('/signin', validateSignin, signin)
router.post('/signup', validateSignup, signup)
router.post('/signout', authValidate, signout)
router.post('/allsignout', authValidate, removeAllsessions)

export default router
