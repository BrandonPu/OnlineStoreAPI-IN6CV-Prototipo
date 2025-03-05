import { Router } from "express";
import { check } from "express-validator";
import { getClients, createUserAdmin, updateUserAdmin, deleteUserAdmin } from "./user.controller.js";
import {  deleteClient } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";

const router = Router();

//ADMIN
router.get(
    "/admin/clients",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    getClients
);

router.put(
    "/admin/:id",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    updateUserAdmin
);

router.post(
    "/admin/createUser",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    createUserAdmin
);

router.delete(
    "/admin/:id",
    [
        validarJWTADMIN,
        validarCampos,
    ],
    deleteUserAdmin
)


//CLIENT
router.delete(
    "/client/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
    ],
    deleteClient
);



export default router;