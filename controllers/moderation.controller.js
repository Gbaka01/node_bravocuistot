import mongoose from "mongoose";
import Recette from "../models/recette.model.js";
import Categorie from "../models/categorie.model.js";

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const populateOptions = [
  {
    path: "author",
    select: "nom prenom email",
  },
  {
    path: "category",
    select: "description2",
  },
];

// Toutes les recettes pour la modération
const getRecettesForModeration = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      if (
        !["pending", "approved", "rejected"].includes(status)
      ) {
        return res.status(400).json({
          message: "Statut de modération invalide",
        });
      }

      filter.status = status;
    }

    const recettes = await Recette.find(filter)
      .populate(populateOptions)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      recettes,
    });
  } catch (error) {
    console.error(
      "Erreur getRecettesForModeration :",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Modifier une recette en tant que modérateur
const updateRecetteByModerator = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fiche,
      description3,
      category,
      status,
      moderationReason,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identifiant de recette invalide",
      });
    }

    const recette = await Recette.findById(id);

    if (!recette) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    if (fiche !== undefined) {
      if (!fiche.trim()) {
        return res.status(400).json({
          message: "Le nom de la recette est obligatoire",
        });
      }

      recette.fiche = fiche.trim();
    }

    if (description3 !== undefined) {
      if (!description3.trim()) {
        return res.status(400).json({
          message: "La description est obligatoire",
        });
      }

      recette.description3 = description3.trim();
    }

    if (category !== undefined) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({
          message: "Identifiant de catégorie invalide",
        });
      }

      const categorieExiste =
        await Categorie.exists({ _id: category });

      if (!categorieExiste) {
        return res.status(404).json({
          message: "Cette catégorie n'existe pas",
        });
      }

      recette.category = category;
    }

    if (status !== undefined) {
      if (
        !["pending", "approved", "rejected"].includes(status)
      ) {
        return res.status(400).json({
          message: "Statut de modération invalide",
        });
      }

      if (
        status === "rejected" &&
        !moderationReason?.trim()
      ) {
        return res.status(400).json({
          message:
            "Le motif est obligatoire pour refuser la recette",
        });
      }

      recette.status = status;
      recette.moderationReason =
        status === "rejected"
          ? moderationReason.trim()
          : null;

      recette.moderatedBy =
        req.user?.id || req.user?._id;
      recette.moderatedAt = new Date();
    }

    if (req.file) {
      recette.image = `/uploads/${req.file.filename}`;
    }
    recette.fiche = req.body.fiche;
recette.description3 = req.body.description3;
recette.status = req.body.status;
recette.moderationReason =
  req.body.moderationReason || "";

    await recette.save();
    await recette.populate(populateOptions);

    return res.status(200).json({
      message: "Recette modifiée avec succès",
      recette,
    });
  } catch (error) {
    console.error(
      "Erreur updateRecetteByModerator :",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Approuver ou refuser rapidement
const moderateRecette = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, moderationReason } = req.body;
    const moderatorId =
      req.user?.id || req.user?._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identifiant de recette invalide",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Le statut doit être approved ou rejected",
      });
    }

    if (
      status === "rejected" &&
      !moderationReason?.trim()
    ) {
      return res.status(400).json({
        message:
          "Le motif est obligatoire pour refuser la recette",
      });
    }

    const recette = await Recette.findById(id);

    if (!recette) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    recette.status = status;
    recette.moderationReason =
      status === "rejected"
        ? moderationReason.trim()
        : null;

    recette.moderatedBy = moderatorId;
    recette.moderatedAt = new Date();

    await recette.save();

    return res.status(200).json({
      message:
        status === "approved"
          ? "Recette approuvée"
          : "Recette refusée",
      recette,
    });
  } catch (error) {
    console.error("Erreur moderateRecette :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Supprimer une recette en tant que modérateur
const deleteRecetteByModerator = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Identifiant de recette invalide",
      });
    }

    const recette = await Recette.findById(id);

    if (!recette) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    await recette.deleteOne();

    return res.status(200).json({
      message: "Recette supprimée par le modérateur",
    });
  } catch (error) {
    console.error(
      "Erreur deleteRecetteByModerator :",
      error
    );

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

export {
  getRecettesForModeration,
  updateRecetteByModerator,
  moderateRecette,
  deleteRecetteByModerator,
};