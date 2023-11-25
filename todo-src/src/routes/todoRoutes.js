import { Router } from 'express'
import { authValidate } from '../middlewares/validateAuth.js'
import { addTODO, deleteAllTODO, deleteTODO, getPagedTODO, getTODO, updateTODO } from '../controllers/todoController.js'

const router = Router()

router.get('/list', authValidate, getTODO)
router.get('/paged', authValidate, getPagedTODO)
router.post('/add', authValidate, addTODO)
router.put('/edit/:id', authValidate, updateTODO)
router.delete('/delete/:id', authValidate, deleteTODO)
router.delete('/deleteAll', authValidate, deleteAllTODO)

export default router
