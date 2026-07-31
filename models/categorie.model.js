import mongoose from 'mongoose';

const categorieSchema = new mongoose.Schema({
    description2: {
      type: String,
      required:true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
}, { timestamps: true });

export default mongoose.model('Categorie', categorieSchema);
