import mongoose from 'mongoose';

const ReturGudangSchema = new mongoose.Schema({
    no_surat_jalan: {
        type: String,
        required: true
    },
    tanggal: {
        type: String,
        required: true
    },
    yang_menerima: {
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
    },
    yang_membawa: {
        type: String,
        required: true
    }
});

export default mongoose.models.ReturGudang || mongoose.model('ReturGudang', ReturGudangSchema);