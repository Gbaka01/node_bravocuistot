
import { Router } from "express";
import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from "../controllers/note.controller.js"
import auth from "../middlewares/auth.js";
const router = Router()

router.post('/new',auth,  createNote)
router.get('/all',auth,  getAllNotes)
router.get('/:id',auth,  getNoteById)
router.put('/:id',auth,  updateNote)
router.delete('/:id',auth,  deleteNote)

export default router