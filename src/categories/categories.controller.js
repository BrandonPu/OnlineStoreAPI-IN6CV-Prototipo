import Category from "./categories.model.js";

export const saveCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "La categoría ya existe" });
        }

        const category = new Category({ name, description });
        await category.save();

        res.status(201).json({ message: "Categoría creada con éxito", category });
    } catch (error) {
        res.status(500).json({ message: "Error al crear categoría", error });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (categories.length === 0) {
            return res.status(404).json({ message: "No hay categorías disponibles" });
        }

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener categorías", error });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Categoría eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar categoría", error });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        category.name = name;
        category.description = description;
        await category.save();

        res.status(200).json({ message: "Categoría actualizada", category });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar categoría", error });
    }
};