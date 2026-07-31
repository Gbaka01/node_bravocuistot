import joi from "joi";

export default function categorieValidation(body){
    const categorieCreate = joi.object({
      description2: joi.string().required()
  });

    const categorieUpdate = joi.object({
      description2: joi.string()
  });

    return {
        categorieCreate: categorieCreate.validate(body),
        categorieUpdate: categorieUpdate.validate(body),
    }
}
