import Note from "../models/note.model.js";
import Recette from "../models/recette.model.js";
import noteValidation from "../validations/note.validation.js";

const createNote = async (req, res) => {
  try {
    const { body } = req;
    const { description1, recetty } = body;

    const { error } = noteValidation(body).noteCreate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Vérification de l'existence de la recette
    const recetteExiste = await Recette.findById(recetty);

    if (!recetteExiste) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    const note = new Note({
      description1,
      author: req.user.id,
      recetty,
    });

    const newNote = await note.save();

    await newNote.populate([
      {
        path: "author",
        select: "nom prenom email",
      },
      {
        path: "recetty",
        select: "description3 fiche",
      },
    ]);

    return res.status(201).json({
      message: "Note créée avec succès",
      note: newNote,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("author", "nom prenom email")
      .populate("recetty", "description3 fiche")
      .lean();

    return res.status(200).json(notes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("author", "nom prenom email")
      .populate("recetty", "description3 fiche");

    if (!note) {
      return res.status(404).json({
        message: "Cette note n'existe pas",
      });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { body } = req;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        message: "Aucune donnée dans la requête",
      });
    }

    // C'était recetteUpdate au lieu de noteUpdate
    const { error } = noteValidation(body).noteUpdate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Il faut rechercher dans Note et non dans Recette
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Cette note n'existe pas",
      });
    }

    if (note.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier cette note",
      });
    }

    // Vérifier la recette si elle est modifiée
    if (body.recetty) {
      const recetteExiste = await Recette.findById(body.recetty);

      if (!recetteExiste) {
        return res.status(404).json({
          message: "Cette recette n'existe pas",
        });
      }
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("author", "nom prenom email")
      .populate("recetty", "description3 fiche");

    return res.status(200).json({
      message: "Note modifiée avec succès",
      note: updatedNote,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Cette note n'existe pas",
      });
    }

    if (note.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cette note",
      });
    }

    await note.deleteOne();

    return res.status(200).json({
      message: "Note supprimée avec succès",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};