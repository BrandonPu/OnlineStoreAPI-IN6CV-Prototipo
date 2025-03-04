import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(), 
    body("surname", "El apellido es obligatorio").not().isEmpty(), 
    body("username", "El nombre de usuario es obligatorio").not().isEmpty(), 
    body("email", "Debes ingresar un email válido").isEmail(), 
    body("email").custom(existenteEmail), 
    body("role").optional().custom(esRoleValido),
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }), 
    validarCampos 
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingrese un email valido"),
    body ("username").optional().isString().withMessage("Ingrese un nombre de usuario valido"),
    body("password", "La contrasela tiene que ser minimo de 6").isLength({min: 6}),
    validarCampos
]