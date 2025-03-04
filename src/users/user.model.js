import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es Obligatorio"],
    },
    surname: {
        type: String,
        required: [true, "El apellido es Obligatorio"],
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es Obligatorio"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "El email es Obligatorio"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es Obligatoria"],
    },
    role: {
        type: String,
        default: "CLIENT",
        enum: ["ADMIN", "CLIENT"],
    },
    purchaseHistory: [{
        type: Schema.Types.ObjectId,
        ref: "PurchaseHistory",
    }],
    state: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model("User", UserSchema);