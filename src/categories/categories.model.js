import { Schema, model } from "mongoose";

const CategoriesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        }
    }, 
    {
    timestamps: true,
    versionKey: false
    }
)

export default model('Categories', CategoriesSchema);