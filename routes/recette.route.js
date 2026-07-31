
import { Router } from "express";
import { createRecette, getAllRecettes, getRecetteById, updateRecette, deleteRecette } from "../controllers/recette.controller.js"
import { upload } from "../middlewares/multer.js"
import auth from "../middlewares/auth.js";
const router = Router()

router.post('/new', auth, upload.single("image"), createRecette)
router.get('/all', getAllRecettes)
router.get('/:id', getRecetteById)
router.put('/:id',auth, upload.single("image"), updateRecette)
router.delete('/:id',auth, deleteRecette)

export default router