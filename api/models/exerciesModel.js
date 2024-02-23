import mongoose from "mongoose";

const excersieSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    exerciseName: {
        type: String,
        required: true
    },
    exerciseDescription: {
        type: String,
    },
    exerciseVideo: {
        type: String,
    }
})


const setExerciesToCustomerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    exerciseId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    setNumbers: {
        type: String,
    }

}, {
    timestamps: true
}) 

const Exercies = mongoose.model("Exercies", excersieSchema)
const SetExerciesToCustomer = mongoose.model("SetExerciesToCustomer", setExerciesToCustomerSchema)

export { Exercies, SetExerciesToCustomer }