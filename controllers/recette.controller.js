import mongoose from "mongoose";
import Recette from "../models/recette.model.js";
import Categorie from "../models/categorie.model.js";
import recetteValidation from "../validations/recette.validation.js";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const populateOptions = [
  {
    path: "author",
    select: "nom prenom email",
  },
  {
    path: "category",
    select: "description2",
  },
  {
    path: "ingredients",
    select: "description",
  },
];

// Créer une recette
const createRecette = async (req, res) => {
  try {
    console.log("Content-Type :", req.headers["content-type"]);
    console.log("req.body :", req.body);
    console.log("req.file :", req.file);

    const authorId = req.user?.id || req.user?._id;

    if (!authorId || !isValidObjectId(authorId)) {
      return res.status(401).json({
        message: "Utilisateur non authentifié ou identifiant invalide",
      });
    }

    const bodyToValidate = {
      fiche: req.body?.fiche,
      description3: req.body?.description3,
      category: req.body?.category,
    };

    const { error, value } =
      recetteValidation(bodyToValidate).recetteCreate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { fiche, description3, category } = value;

    if (!isValidObjectId(category)) {
      return res.status(400).json({
        message: "Identifiant de catégorie invalide",
      });
    }

    const categorieExiste = await Categorie.findById(category);

    if (!categorieExiste) {
      return res.status(404).json({
        message: "Cette catégorie n'existe pas",
      });
    }

    const recette = await Recette.create({
      fiche,
      description3,
      category,
      author: authorId,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : null,
    });

    await recette.populate(populateOptions);

    return res.status(201).json({
      message: "Recette créée avec succès",
      recette,
    });
  } catch (error) {
    console.error("Erreur createRecette :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Récupérer toutes les recettes
const getAllRecettes = async (req, res) => {
  try {
    const recettes = await Recette.find()
      .populate(populateOptions)
      .lean();

    return res.status(200).json({
      recettes,
    });
  } catch (error) {
    console.error("Erreur getAllRecettes :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Récupérer les recettes de l'utilisateur connecté
const getMyRecettes = async (req, res) => {
  try {
    const authorId = req.user?.id || req.user?._id;

    if (!authorId) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    if (!isValidObjectId(authorId)) {
      return res.status(401).json({
        message: "Identifiant utilisateur invalide",
      });
    }

    const recettes = await Recette.find({
      author: authorId,
    })
      .populate(populateOptions)
      .lean();

    return res.status(200).json({
      recettes,
    });
  } catch (error) {
    console.error("Erreur getMyRecettes :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Récupérer une recette par son identifiant
const getRecetteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identifiant de recette invalide",
      });
    }

    const recette = await Recette.findById(id).populate(populateOptions);

    if (!recette) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    return res.status(200).json({
      recette,
    });
  } catch (error) {
    console.error("Erreur getRecetteById :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Modifier une recette
const updateRecette = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    const authorId = req.user?.id || req.user?._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identifiant de recette invalide",
      });
    }

    if (!authorId || !isValidObjectId(authorId)) {
      return res.status(401).json({
        message: "Utilisateur non authentifié ou identifiant invalide",
      });
    }

    if (Object.keys(body).length === 0 && !req.file) {
      return res.status(400).json({
        message: "Aucune donnée dans la requête",
      });
    }

    const { error } = recetteValidation(body).recetteUpdate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    if (body.category) {
      if (!isValidObjectId(body.category)) {
        return res.status(400).json({
          message: "Identifiant de catégorie invalide",
        });
      }

      const categorieExiste = await Categorie.findById(body.category);

      if (!categorieExiste) {
        return res.status(404).json({
          message: "Cette catégorie n'existe pas",
        });
      }
    }

    const recette = await Recette.findById(id);

    if (!recette) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    if (!recette.author) {
      return res.status(400).json({
        message: "Cette recette ne possède aucun auteur",
      });
    }

    if (recette.author.toString() !== authorId.toString()) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier cette recette",
      });
    }

    if (req.file) {
      body.image = `/uploads/${req.file.filename}`;
    }

    const updatedRecette = await Recette.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate(populateOptions);

    return res.status(200).json({
      message: "Recette modifiée avec succès",
      recette: updatedRecette,
    });
  } catch (error) {
    console.error("Erreur updateRecette :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Supprimer une recette
const deleteRecette = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user?.id || req.user?._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identifiant de recette invalide",
      });
    }

    if (!authorId || !isValidObjectId(authorId)) {
      return res.status(401).json({
        message: "Utilisateur non authentifié ou identifiant invalide",
      });
    }

    const recette = await Recette.findById(id);

    if (!recette) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    if (!recette.author) {
      return res.status(400).json({
        message: "Cette recette ne possède aucun auteur",
      });
    }

    if (recette.author.toString() !== authorId.toString()) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cette recette",
      });
    }

    await recette.deleteOne();

    return res.status(200).json({
      message: "Recette supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteRecette :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

export {
  createRecette,
  getAllRecettes,
  getMyRecettes,
  getRecetteById,
  updateRecette,
  deleteRecette,
};