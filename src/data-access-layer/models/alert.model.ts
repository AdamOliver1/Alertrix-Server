import mongoose, { Document, Schema } from 'mongoose';
import { Alert } from '../../types/alert';

// Interface for the document in MongoDB
export interface AlertDocument extends Omit<Alert, 'id'>, Document {
  id: string; // Override id to be compatible with MongoDB's _id
}

// Define the Mongoose schema for the alert
const alertSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    emails: { 
      type: [String], 
      required: true, 
      validate: [
        {
          validator: (val: string[]) => val.length <= 5,
          message: 'Maximum of 5 email addresses allowed'
        }
      ]
    },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
      name: { type: String },
    },
    condition: {
      parameter: { type: String, required: true },
      operator: { type: String, required: true, enum: ['>', '<', '>=', '<=', '=', '!='] },
      value: { type: Number, required: true },
    },
    isTriggered: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create and export the model
export const AlertModel = mongoose.model<AlertDocument>('Alert', alertSchema); 