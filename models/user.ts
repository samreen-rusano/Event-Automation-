import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    registeredAt: { type: Date, default: Date.now },
    isPaid: { type: Boolean, default: false },
    purchasedItems: { type: [String], default: [] }, // e.g. "framework", "order_bump", "upsell"
    lastEmailType: String,
    lastSentAt: { type: Date },
    sentEmails: { type: [String], default: [] },
});

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);