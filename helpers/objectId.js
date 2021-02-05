import mongoose from 'mongoose';

export default function (id) {
    return mongoose.Types.ObjectId(id)
}