import { Router } from "express";
import { check } from "express-validator";
import { saveCategory, getCategories, deleteCategory, updateCategory } from "./categories.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";

const router = Router();

router.get(
    "/",
    [
        validarJWTADMIN,
    ],
    getCategories
);  

router.post(
    "/",
    [
        validarJWTADMIN,
    ],
    saveCategory
);

router.delete(
    "/:id", 
    [
        validarJWTADMIN,
    ],
    deleteCategory
);  

router.put(
    "/:id", 
    [
        validarJWTADMIN,
    ],
    updateCategory
);  

export default router;