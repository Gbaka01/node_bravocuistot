import multer from "multer";
import path from "node:path"; // permet de manipuler des fichiers/dossiers
import fs from "node:fs"; // permet de lire/écrire/supprimer/créer des fichiers/dossiers
import { fileURLToPath } from "node:url"; // permet d'accédezr à__dirname et __filename avec ES Moodules ({"type": "module"} dans package.json)

// Avec ES Modules ({"type": "module"} dans package.json), les variables __filename et __dirname n'existent plus. On doit donc les recréer. "import.meta.url" retourne l'url du dossier actuel par exemple : "file:///C:/Users/bonen/mon-projet/controllers/animal.controller.js"). Pour le convertir en chemin on utilise la fonction fileURLToPath() (pour obtenir dans l'exemple précédent "C:\Users\bonen\mon-projet\controllers\animal.controller.js")
const __filename = fileURLToPath(import.meta.url)
// path.dirname() permet de récupérer le dossier parent à partir d'un chemin (dans l'exemple : "C:/Users/bonen/mon-projet/controllers")
const __dirname = path.dirname(__filename)

//création du dossier /uploads
const uploadDir = path.join(__dirname, '../uploads')
if(!fs.existsSync(uploadDir)) {fs.mkdirSync(uploadDir, {recursive: true})}

// config du stokage de multer
const storage = multer.diskStorage({
    //destination de fichier
    destination: (req, file, cb) => {
        // if(file.mimetype !="image/jpeg"){
        //     return cb(new Error("Seuls les fichiers jpeg sont acceptés"), null)
        // }
        cb(null, uploadDir)
    },

    // on renome le fichier pour éviter les doublons
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const baseName = path.basename(file.originalname, ext)
        cb(null, `${baseName}_${Date.now()}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error("Type de fichier non autorisé"), false)
    }
}
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 10 * 1024 * 1024,
        files: 10,
    } 
})