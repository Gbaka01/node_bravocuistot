import Joi from "joi";

export default function noteValidation(body) {
  const noteCreate = Joi.object({
    description1: Joi.string().trim().required(),
    recetty: Joi.string().hex().length(24).required(),
  });

  const noteUpdate = Joi.object({
    description1: Joi.string().trim(),
    recetty: Joi.string().hex().length(24),
  }).min(1);

  return {
    noteCreate: noteCreate.validate(body),
    noteUpdate: noteUpdate.validate(body),
  };
}
