import { Router } from "express";
import { check } from "express-validator";
import { createUser, changeRole } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";

const router = Router();

//ADMIN
router.put(
    "/role/:id",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    changeRole
);

router.post(
    "/createUser",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    createUser
);


//CLIENT


export default router;