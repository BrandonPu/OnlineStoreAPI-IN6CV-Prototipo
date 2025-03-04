import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js"

//ADMIN
export const createUser = async (req = request, res = response) => {
    const data = req.body;
    try {
        const existingUser = await User.findOne({
            $or: [{ username: data.username }, { email: data.email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'El correo o nombre de usuario ya están registrados. Por favor, ingrese otro diferente.'
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role,
            purchaseHistory: [],
            estado: true
        })

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            userDetails: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "El nombre de usuario o el correo ya están en uso. Por favor ingrese otro diferente.",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Error al registrar el usuario",
            error: error.message
        });
    }
}

export const changeRole = async (req = request, res = response) => {
    try {
        
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !["ADMIN", "CLIENT"].includes(role)) {
            return res.status(400).json({
                success: false,
                msg: "Rol no válido"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Rol actualizado con éxito",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al cambiar el rol",
            error: error.message
        });
    }
}
