import Categorie from "../models/categorie.model.js";
import categorieValidation from "../validations/categorie.validation.js";

const createCategorie = async (req, res) => {
  try {
    const { body } = req;
    const { description2 } = body;

    const { error } = categorieValidation(body).categorieCreate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const categorie = new Categorie({
      description2,
      author: req.user.id,
    });

    const newCategorie = await categorie.save();

    await newCategorie.populate({
      path: "author",
      select: "nom prenom email",
    });

    return res.status(201).json({
      message: "Catégorie créée avec succès",
      categorie: newCategorie,
    });
  } catch (error) {
    console.error("Erreur createCategorie :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find()
      .populate("author", "nom prenom email")
      .lean();

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Erreur getAllCategories :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id).populate(
      "author",
      "nom prenom email"
    );

    if (!categorie) {
      return res.status(404).json({
        message: "Cette catégorie n'existe pas",
      });
    }

    return res.status(200).json(categorie);
  } catch (error) {
    console.error("Erreur getCategorieById :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const updateCategorie = async (req, res) => {
  try {
    const { body } = req;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        message: "Aucune donnée dans la requête",
      });
    }

    const { error } = categorieValidation(body).categorieUpdate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const categorie = await Categorie.findById(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Cette catégorie n'existe pas",
      });
    }

    if (categorie.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier cette catégorie",
      });
    }

    const updatedCategorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("author", "nom prenom email");

    return res.status(200).json({
      message: "Catégorie modifiée avec succès",
      categorie: updatedCategorie,
    });
  } catch (error) {
    console.error("Erreur updateCategorie :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Cette catégorie n'existe pas",
      });
    }

    if (categorie.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cette catégorie",
      });
    }

    await categorie.deleteOne();

    return res.status(200).json({
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteCategorie :", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

export {
  createCategorie,
  getAllCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie,
};