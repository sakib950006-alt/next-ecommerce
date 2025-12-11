import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin","user"], default: "user", required: true },
    isEmailVerified: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    avatar: {url:{type: String, trim: true},public_id:{type: String, trim:true}},
    phone: {type: String, trim : true},
  },
  { timestamps: true }
);

// ✅ pre-save hook to hash password
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
});

// ✅ compare password method
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

export default mongoose.models.User || mongoose.model("User", userSchema);
