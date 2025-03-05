import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js"

//ADMIN

export const getClients = async (req, res = response) => {
    try {

        const clients = await User.find({ role: 'CLIENT' });

        res.status(200).json({
            success: true,
            clients
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener los clientes",
            error: error.message
        });
    }
}

export const createUserAdmin = async (req = request, res = response) => {
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

export const updateUserAdmin = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, email, password, role, ...data } = req.body;

        if (email || password) {
            return res.status(400).json({
                success: false,
                msg: "No puedes actualizar el email o la contraseña desde esta ruta para no perjudicar al usuario"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (role) {
            if (!["ADMIN", "CLIENT"].includes(role)) {
                return res.status(400).json({
                    success: false,
                    msg: "Rol no válido"
                });
            }
            user.role = role;
        }

        Object.assign(user, data);
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado correctamente",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

export const deleteUserAdmin = async (req, res) => {
    try {
        
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });

        const autheticatedUser = req.user;

        res.status(200).json({
            success: true,
            msg: "Usario desactivado",
            user,
            autheticatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al Desactivar Usuario",
            error
        })
    }   
}

//CLIENT

export const deleteClient = async (req, res = response) => {
    try {
        const { id } = req.params;
        const confirmacion = req.header('confirmacion');
        const authenticatedUserId = req.usuario._id.toString();

        if (id !== authenticatedUserId) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para eliminar esta cuenta"
            });
        }

        if (confirmacion !== 'yes') {
            return res.status(400).json({
                success: false,
                msg: "Debe confirmar la eliminación de la cuenta enviando 'confirmacion: yes' en los encabezados de la solicitud"
            });
        }

        const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Cliente no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Cliente desactivado",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al desactivar cliente",
            error: error.message
        });
    }
};