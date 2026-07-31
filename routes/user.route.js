
import { Router } from "express";
import { register, login, getAll, getOne, updateUser, deleteOne } from "../controllers/user.controller.js"
import auth from '../middlewares/auth.js'
const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/all',auth,  getAll)
router.get('/:id',auth,  getOne)
router.put('/:id',auth,  updateUser)
router.delete('/:id',auth,  deleteOne)

export default router