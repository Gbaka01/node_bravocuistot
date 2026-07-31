
import { Router } from "express";
import { createIngredient, getAllIngredients, getIngredientById, updateIngredient, deleteIngredient } from "../controllers/ingredient.controller.js"
import auth from "../middlewares/auth.js";
const router = Router()

router.post('/new', auth,  createIngredient)
router.get('/all',auth, getAllIngredients)
router.get('/:id',auth,  getIngredientById)
router.put('/:id',auth,  updateIngredient)
router.delete('/:id',auth,  deleteIngredient)

export default router