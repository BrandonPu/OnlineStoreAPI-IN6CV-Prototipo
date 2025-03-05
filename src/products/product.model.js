import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, "El precio no puede ser negativo"],
        },
        stock: {
          type: Number,
          required: true,
          min: [0, "El stock no puede ser negativo"],
        },
        soldCount: {
          type: Number,
          default: 0,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        isSoldOut: {
            type: Boolean,
            default: false,
        },
    },
    {
      timestamps: true, 
      versionKey: false,
    }
)

export default model("Product", productSchema);