import mongoose from "mongoose";

export const connectDB =async ()=>{
    await mongoose.connect('mongodb+srv://samuk0398_db_user:Gq3SS08n1QdWnLJB@cluster0.ov9koec.mongodb.net/L-M-S')
    .then(()=>{console.log('db connected')})
}