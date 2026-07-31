import Ingredient from "../models/ingredient.model.js";
import ingredientValidation from "../validations/ingredient.validation.js";
import Recette from "../models/recette.model.js";

const createIngredient = async (req, res) => {
  try {
    const { body } = req;
    const { description, recetty } = body;

    const { error } = ingredientValidation(body).ingredientCreate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Il faut rechercher la recette dans le modèle Recette
    const recetteExiste = await Recette.findById(recetty);

    if (!recetteExiste) {
      return res.status(404).json({
        message: "Cette recette n'existe pas",
      });
    }

    const ingredient = new Ingredient({
      description,
      recetty,
      author: req.user.id,
    });

    const newIngredient = await ingredient.save();

    await newIngredient.populate([
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
      message: "Ingrédient créé avec succès",
      ingredient: newIngredient,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
      .populate("recetty", "description3 fiche")
      .populate("author", "nom prenom email")
      .lean();

    return res.status(200).json(ingredients);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
      .populate("recetty", "description3 fiche")
      .populate("author", "nom prenom email");

    if (!ingredient) {
      return res.status(404).json({
        message: "Cet ingrédient n'existe pas",
      });
    }

    return res.status(200).json(ingredient);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const { body } = req;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        message: "Aucune donnée dans la requête",
      });
    }

    const { error } = ingredientValidation(body).ingredientUpdate;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Cet ingrédient n'existe pas",
      });
    }

    if (!ingredient.author) {
      return res.status(400).json({
        message: "Cet ingrédient ne possède pas d'auteur",
      });
    }

    if (ingredient.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier cet ingrédient",
      });
    }

    // Vérifier la nouvelle recette si recetty est modifié
    if (body.recetty) {
      const recetteExiste = await Recette.findById(body.recetty);

      if (!recetteExiste) {
        return res.status(404).json({
          message: "Cette recette n'existe pas",
        });
      }
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("recetty", "description3 fiche")
      .populate("author", "nom prenom email");

    return res.status(200).json({
      message: "Ingrédient modifié avec succès",
      ingredient: updatedIngredient,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        message: "Cet ingrédient n'existe pas",
      });
    }

    if (!ingredient.author) {
      return res.status(400).json({
        message: "Cet ingrédient ne possède pas d'auteur",
      });
    }

    if (ingredient.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cet ingrédient",
      });
    }

    await ingredient.deleteOne();

    return res.status(200).json({
      message: "Ingrédient supprimé avec succès",
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
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
};