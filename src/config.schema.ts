import * as joi from "@hapi/joi"


export const configValidationSchema = joi.object({
    STAGE: joi.string().required() ,
    DB_URL: joi.string().required() ,
    JWT_SECRET: joi.string().required() 
})