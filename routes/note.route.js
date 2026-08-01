
import { Router } from "express";
import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from "../controllers/note.controller.js"
import auth from "../middlewares/auth.js";
const router = Router()

router.post('/new',auth,  createNote)
router.get('/all',  getAllNotes)
router.get('/:id',  getNoteById)
router.put('/:id',  updateNote)
router.delete('/:id',auth,  deleteNote)

export default router