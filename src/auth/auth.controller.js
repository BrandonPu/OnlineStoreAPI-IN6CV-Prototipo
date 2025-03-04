import { hash, verify } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js";
import Usuario from "../users/user.model.js";


export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo o nombre de usuario no existe en la base de datos.'
            });
        }

        if (!user.state) {
            return res.status(400).json({
                msg: 'El usuario está deshabilitado. Por favor, contacte con el administrador.'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta. Por favor, intente nuevamente.'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso.',
            userDetails: {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token,
                purchaseHistory: user.purchaseHistory
            }
        });

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Error del servidor",
            error: e.message
        });
    }
};

export const register = async (req, res) => {
    const data = req.body;

    try {

        if (data.role === 'ADMIN') {
            return res.status(400).json({
                message: 'No se puede registrar un usuario con el rol ADMIN_ROLE.'
            });
        }

        const existingUser = await Usuario.findOne({
            $or: [{ username: data.username }, { email: data.email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'El correo o el nombre de usuario ya están registrados. Por favor ingrese otro diferente.'
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role || "CLIENT",  
            purchaseHistory: [],
            estado: true 
        });

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            userDetails: {
                username: user.username,
                email: user.email
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
};

export const createAdminUser = async () => {
    try {
        const adminExists = await Usuario.findOne({ role: "ADMIN" });

        if (!adminExists) {
            const hashedPassword = await hash("admin2025");

            const adminUser = new Usuario({ 
                name: "Admin",
                surname: "System",
                username: "AdminSystem",
                email: "admin@system.com",
                password: hashedPassword,
                role: "ADMIN",
            });

            await adminUser.save();
            console.log("Administrador Se ha creado correctamente.");
        } else {
            console.log("Administrador ya existente en la base de datos.");
        }
    } catch (error) {
        console.error("Error al crear el administrador por favor revisa:", error);
    }//BrandonPu
};