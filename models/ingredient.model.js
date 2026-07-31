import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true
    },
    recetty : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recette"
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
}, { timestamps: true });

export default mongoose.model('Ingredient', ingredientSchema);
