import mongoose from 'mongoose';

const ReturPabrikSchema = new mongoose.Schema({
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
    yang_mengeluarkan: {
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

export default mongoose.models.ReturPabrik || mongoose.model('ReturPabrik', ReturPabrikSchema);