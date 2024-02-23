import mongoose from "mongoose";

const dietSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    meal: {
        type: String,
    },
    foodDescription: {
        type: String,
        required: true
    },
    calorie: {
        type: Number,
    },
    
}, { timestamps: true })



const Diet = mongoose.model("diet", dietSchema);
export default Diet