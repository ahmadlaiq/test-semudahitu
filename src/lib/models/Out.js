import mongoose from 'mongoose';

const OutSchema = new mongoose.Schema({
    no_surat_jalan: {
        type: String,
        required: true
    },
    tanggal: {
        type: String,
        required: true
    },
    yang_mengeluarkan: {
        type: String,
        required: true
    },
    yang_membawa: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    nama_barang: {
        type: String,
        required: true
    }
});

export default mongoose.models.Out || mongoose.model('Out', OutSchema);