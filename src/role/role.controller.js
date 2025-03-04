import Role from "./role.model.js"

export const createDefaultRoles = async () => {
    try {
        const roles = await Role.find();

        if (roles.length === 0) {
            const defaultRoles = [
                { role: 'ADMIN' },
                { role: 'CLIENT' }
            ];

            await Role.insertMany(defaultRoles);
            console.log("Roles por defecto creados: ADMIN y CLIENT");
        } else {
            console.log("Los roles ya están presentes en la base de datos.");
        }//BrandonPu
    } catch (error) {
        console.error("Error al crear los roles:", error);
    }
};