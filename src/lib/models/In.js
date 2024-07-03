import mongoose from 'mongoose';

const InSchema = new mongoose.Schema({
    no_surat_jalan: {
        type: String,
        required: true
    },
    tanggal: {
        type: String,
        required: true
    },
    nama_supplier: {
        type: String,
        required: true
    },
    nama_barang: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    }
});

export default mongoose.models.In || mongoose.model('In', InSchema);