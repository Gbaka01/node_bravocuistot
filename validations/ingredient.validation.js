import joi from "joi";

export default function ingredientValidation(body){
    const ingredientCreate = joi.object({
      description: joi.string().trim().required(),
      recetty: joi.string().hex().length(24).required(),
  });

    const ingredientUpdate = joi.object({
      description: joi.string().trim(),
      recetty: joi.string().hex().length(24).required(),
  });

    return {
        ingredientCreate: ingredientCreate.validate(body),
        ingredientUpdate: ingredientUpdate.validate(body),
    }
}
