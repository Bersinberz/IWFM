// models/Alert.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  type: string;
  severity: 'low' | 'medium' | 'high';
  tanker: string;
  ts: Date;
  description: string;
  status: 'active' | 'resolved' | 'acknowledged';
  location?: {
    type: string;
    coordinates: [number, number];
  };
  resolvedAt?: Date;
  acknowledgedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Low Level',
      'PH Out of Range', 
      'Battery Low',
      'GPS Signal Lost',
      'Over Speeding',
      'Engine Overheating',
      'Leakage Detected',
      'Unauthorized Stop',
      'Door Tampering',
      'Communication Failure'
    ]
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  tanker: {
    type: String,
    required: true,
    ref: 'Tanker'
  },
  ts: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'acknowledged'],
    default: 'active'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  resolvedAt: {
    type: Date
  },
  acknowledgedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
alertSchema.index({ ts: -1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ tanker: 1 });
alertSchema.index({ status: 1 });

export default mongoose.model<IAlert>('Alert', alertSchema);