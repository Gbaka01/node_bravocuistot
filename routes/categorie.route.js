
import { Router } from "express";
import { createCategorie, getAllCategories, getCategorieById, updateCategorie, deleteCategorie } from "../controllers/categorie.controller.js"
import auth from "../middlewares/auth.js";
const router = Router()

router.post('/new',auth,  createCategorie)
router.get('/all', getAllCategories)
router.get('/:id', getCategorieById)
router.put('/:id',auth, updateCategorie)
router.delete('/:id',auth, deleteCategorie)

export default router