const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
// CRUD untuk tabel KTP
// Mendapatkan semua data dari tabel KTP
router.get('/ktp', (req, res) => {
    db.query('SELECT * FROM ktp', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP',
                data: rows,
            });
        }
    });
});

// Menambahkan data baru ke tabel KTP
router.post('/ktp/add', [
    // Validasi untuk input data
    body('nik').notEmpty().withMessage('NIK harus diisi'),
    body('nama_lengkap').notEmpty().withMessage('Nama lengkap harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema KTP
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const data = {
        nik: req.body.nik,
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin,
        tempat_lahir: req.body.tempat_lahir,
        tanggal_lahir: req.body.tanggal_lahir,
        agama: req.body.agama,
        pendidikan: req.body.pendidikan,
        jenis_pekerjaan: req.body.jenis_pekerjaan,
        golongan_darah: req.body.golongan_darah,
        kewarganegaraan: req.body.kewarganegaraan,
    };

    db.query('INSERT INTO ktp SET ?', data, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            data.nik = result.insertId;
            return res.status(201).json({
                status: true,
                message: 'Data KTP berhasil ditambahkan',
                data: data,
            });
        }
    });
});

// Mendapatkan data KTP berdasarkan NIK
router.get('/ktp/:nik', (req, res) => {
    const nik = req.params.nik;
    db.query('SELECT * FROM ktp WHERE nik = ?', nik, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data KTP tidak ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP',
                data: rows[0], // Mengambil data pertama karena NIK harus unik
            });
        }
    });
});

// Memperbarui data di tabel KTP
router.patch('/ktp/:nik', [
    // Validasi untuk input data yang akan diperbarui
    body('nama_lengkap').notEmpty().withMessage('Nama lengkap harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema KTP
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const nik = req.params.nik;
    const data = {
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin,
        tempat_lahir: req.body.tempat_lahir,
        tanggal_lahir: req.body.tanggal_lahir,
        agama: req.body.agama,
        pendidikan: req.body.pendidikan,
        jenis_pekerjaan: req.body.jenis_pekerjaan,
        golongan_darah: req.body.golongan_darah,
        kewarganegaraan: req.body.kewarganegaraan,
    };

    db.query('UPDATE ktp SET ? WHERE nik = ?', [data, nik], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP berhasil diperbarui',
            });
        }
    });
});

// Menghapus data dari tabel KTP
router.delete('/ktp/:nik', (req, res) => {
    const nik = req.params.nik;
    db.query('DELETE FROM ktp WHERE nik = ?', nik, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data KTP berhasil dihapus',
            });
        }
    });
});

// CRUD untuk tabel Detail KK

// Mendapatkan semua data dari tabel Detail KK
router.get('/detail_kk', (req, res) => {
    db.query('SELECT dk.id_detail, dk.no_kk, dk.nik, dk.status_hubungan_dalam_keluarga, ktp_ayah.nama_lengkap AS ayah, ktp_ibu.nama_lengkap AS ibu FROM detail_kk AS dk LEFT JOIN ktp AS ktp_ayah ON dk.ayah = ktp_ayah.nik LEFT JOIN ktp AS ktp_ibu ON dk.ibu = ktp_ibu.nik', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Detail KK',
                data: rows,
            });
        }
    });
});




router.post('/detail_kk', [
    // Validasi untuk input data
    body('no_kk').notEmpty().withMessage('No. KK harus diisi'),
    body('nik').notEmpty().withMessage('NIK harus diisi'),
    body('status_hubungan_dalam_keluarga').notEmpty().withMessage('Status hubungan harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema Detail KK
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    // Isi data dari permintaan
    const data = {
        no_kk: req.body.no_kk,
        nik: req.body.nik,
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
        ayah: req.body.ayah,
        ibu: req.body.ibu,
    };

    db.query('INSERT INTO detail_kk SET ?', data, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            data.id_detail = result.insertId;
            return res.status(201).json({
                status: true,
                message: 'Data Detail KK berhasil ditambahkan',
                data: data,
            });
        }
    });
});


router.patch('/detail_kk/:id_detail', [
    // Validasi untuk input data yang akan diperbarui
    body('status_hubungan_dalam_keluarga').optional(), // Izinkan status hubungan menjadi opsional
    // Tambahkan validasi lain sesuai dengan skema Detail KK
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const id_detail = req.params.id_detail;
    const data = {
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga || null, // Menggunakan nilai yang diberikan atau null jika tidak ada
        ayah: req.body.ayah,
        ibu: req.body.ibu,
    };

    db.query('UPDATE detail_kk SET ? WHERE id_detail = ?', [data, id_detail], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Detail KK berhasil diperbarui',
            });
        }
    });
});

router.get('/detail_kk/:id_detail', (req, res) => {
    const id_detail = req.params.id_detail;

    // Query basis data untuk mendapatkan data Detail KK berdasarkan id_detail
    db.query('SELECT * FROM detail_kk WHERE id_detail = ?', id_detail, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Detail KK tidak ditemukan',
            });
        }

        const detailKKData = rows[0]; // Ambil data Detail KK pertama dari hasil query

        return res.status(200).json({
            status: true,
            message: 'Data Detail KK berdasarkan ID Detail KK',
            data: detailKKData,
        });
    });
});

// Menghapus data dari tabel Detail KK
router.delete('/detail_kk/:id_detail', (req, res) => {
    const id_detail = req.params.id_detail;
    db.query('DELETE FROM detail_kk WHERE id_detail = ?', id_detail, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Detail KK berhasil dihapus',
            });
        }
    });
});

// CRUD untuk tabel Kartu Keluarga

// Mendapatkan semua data dari tabel Kartu Keluarga
router.get('/kartu_keluarga', (req, res) => {
    db.query('SELECT * FROM kartu_keluarga', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Gagal',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga',
                data: rows,
            });
        }
    });
});

// Menambahkan data baru ke tabel Kartu Keluarga
router.post('/kartu_keluarga', [
    // Validasi untuk input data
    body('no_kk').notEmpty().withMessage('No. KK harus diisi'),
    body('alamat').notEmpty().withMessage('Alamat harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema Kartu Keluarga
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const data = {
        no_kk: req.body.no_kk,
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi,
    };

    db.query('INSERT INTO kartu_keluarga SET ?', data, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            data.no_kk = result.insertId;
            return res.status(201).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil ditambahkan',
                data: data,
            });
        }
    });
});

// Memperbarui data di tabel Kartu Keluarga
router.patch('/kartu_keluarga/:no_kk', [
    // Validasi untuk input data yang akan diperbarui
    body('alamat').notEmpty().withMessage('Alamat harus diisi'),
    // Tambahkan validasi lain sesuai dengan skema Kartu Keluarga
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }

    const no_kk = req.params.no_kk;
    const data = {
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi,
    };

    db.query('UPDATE kartu_keluarga SET ? WHERE no_kk = ?', [data, no_kk], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil diperbarui',
            });
        }
    });
});
// GET data Kartu Keluarga by No. KK
router.get('/kartu_keluarga/:no_kk', (req, res) => {
    const no_kk = req.params.no_kk;
    
    db.query('SELECT * FROM kartu_keluarga WHERE no_kk = ?', no_kk, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Kartu Keluarga tidak ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga',
                data: rows[0],
            });
        }
    });
});

// Menghapus data dari tabel Kartu Keluarga
router.delete('/kartu_keluarga/:no_kk', (req, res) => {
    const no_kk = req.params.no_kk;
    db.query('DELETE FROM kartu_keluarga WHERE no_kk = ?', no_kk, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kartu Keluarga berhasil dihapus',
            });
        }
    });
});

module.exports = router;