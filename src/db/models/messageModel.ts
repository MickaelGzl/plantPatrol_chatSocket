import { Schema, model } from "mongoose";
import { IMessage } from "../../types";

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      maxlength: [
        320,
        "Votre message est trop long (320 caractères max autorisés).",
      ],
      required: [true, "Vous devez écrire un message avant de l'envoyer."],
    },
    userId: {
      type: String,
      required: [true, "Aucun utilisateur associé au message crée."],
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = model(`messages`, messageSchema);
