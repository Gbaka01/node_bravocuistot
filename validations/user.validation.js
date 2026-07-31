import joi from "joi";

export default function userValidation(body){
    const userCreate = joi.object({
      nom: joi.string(),
      prenom: joi.string(),
      password: joi.string().required(),
      email: joi.string().email().required(),
    })
      const userLawLogin = joi.object({
      email : joi.string().email().required(),
      password : joi.string().required()
    })

    const userUpdate = joi.object({
      nom: joi.string(),
      prenom: joi.string(),
      password: joi.string(),
      email: joi.string(),
    })

    return {
        userCreate: userCreate.validate(body),
        userUpdate: userUpdate.validate(body),
        userLawLogin: userLawLogin.validate(body),
    }
}
