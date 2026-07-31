import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true
    },
    prenom: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["user", "moderateur", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

// Chiffrement avant création avec user.save()
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Chiffrement avant findOneAndUpdate()
userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (!update) {
    return;
  }

  const newPassword = update.password ?? update.$set?.password;

  if (!newPassword) {
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  if (update.password) {
    update.password = hashedPassword;
  }

  if (update.$set?.password) {
    update.$set.password = hashedPassword;
  }

  this.setUpdate(update);
});

export default mongoose.model("User", userSchema);