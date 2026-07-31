import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    description1: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    recetty : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recette"
    }

}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
