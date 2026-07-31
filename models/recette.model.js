import mongoose from "mongoose";

const recetteSchema = new mongoose.Schema(
  {
    description3: {
      type: String,
      required: true,
      trim: true,
    },

    fiche: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
      required: true,
    },
  },
  {
    timestamps: true,

    // Nécessaire pour afficher les relations virtuelles
    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

// Relation virtuelle : récupérer les ingrédients associés à la recette
recetteSchema.virtual("ingredients", {
  ref: "Ingredient",
  localField: "_id",
  foreignField: "recetty",
});

const Recette = mongoose.model("Recette", recetteSchema);

export default Recette;
