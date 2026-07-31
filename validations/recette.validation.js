import joi from "joi";

const objectIdSchema = joi.string().trim().hex().length(24);

export default function recetteValidation(body) {
  const recetteCreateSchema = joi.object({
    fiche: joi.string().trim().required().messages({
      "any.required": "Le nom de la recette est obligatoire",
      "string.empty": "Le nom de la recette est obligatoire",
    }),

    description3: joi.string().trim().required().messages({
      "any.required": "La description est obligatoire",
      "string.empty": "La description est obligatoire",
    }),

    category: objectIdSchema.required().messages({
      "any.required": "La catégorie est obligatoire",
      "string.empty": "La catégorie est obligatoire",
      "string.hex": "L'identifiant de catégorie est invalide",
      "string.length":
        "L'identifiant de catégorie doit contenir 24 caractères",
    }),
  });

  const recetteUpdateSchema = joi
    .object({
      fiche: joi.string().trim(),
      description3: joi.string().trim(),
      category: objectIdSchema.messages({
        "string.hex": "L'identifiant de catégorie est invalide",
        "string.length":
          "L'identifiant de catégorie doit contenir 24 caractères",
      }),
    })
    .min(1)
    .messages({
      "object.min": "Au moins une donnée doit être fournie",
    });

  return {
    recetteCreate: recetteCreateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    }),

    recetteUpdate: recetteUpdateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    }),
  };
}