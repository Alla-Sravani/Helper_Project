const multer = require('multer');
const path = require('path');

const express = require('express');
const router = express.Router();
const Helper = require('../models/helper.model'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'photo' ? 'uploads/photos' : 'uploads/kyc';
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

// POST: Create helper with photo and KYC
router.post('/', upload.fields([{ name: 'photo' }, { name: 'kyc' }]), async (req, res) => {
  try {
    const photoPath = req.files?.photo?.[0]?.path || '';
    const kycPath = req.files?.kyc?.[0]?.path || '';
    console.log('Photo path:', req.body);
    req.body.employeeCode = Math.floor(Math.random() * 1000).toString(); // Generate a random employee code

    const newHelper = new Helper({
      employeeCode: req.body.employeeCode?.trim(),
      fullName: req.body.fullName?.trim(),
      serviceType: req.body.serviceType?.trim(),
      organization: req.body.organization?.trim(),
      address: req.body.address?.trim(),
      phone: req.body.phone?.trim(),
      email: req.body.email?.trim(),
      gender: req.body.gender,
      vehicleType: req.body.vehicleType?.trim(),
      languages: JSON.parse(req.body.languages),
      photoUrl: photoPath,
      kycDocumentUrl: kycPath
    });

    const saved = await newHelper.save();
    res.status(201).json(saved);
    console.log('New helper created:', saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// GET: Search, Sort, Count helpers
router.get('/', async (req, res) => {
  try {
    const { search = '', sortBy = 'fullName', order = 'asc' } = req.query;
    const sortDirection = order === 'asc' ? 1 : -1;

    const matchStage = {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } }
      ]
    };

    const result = await Helper.aggregate([
      { $match: matchStage },
      {
        $facet: {
          data: [
            { $sort: { [sortBy]: sortDirection } }
          ],
          count: [
            { $count: 'filteredCount' }
          ]
        }
      }
    ]);

    const filteredResults = result[0].data;
    const filteredCount = result[0].count[0]?.filteredCount || 0;
    const totalCount = await Helper.countDocuments();

    res.json({
      results: filteredResults,
      filteredCount,
      totalCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Aggregation failed' });
  }
});

// GET: Single helper by ID
router.get('/:id', async (req, res) => {
  try {
    const helper = await Helper.findById(req.params.id);
    if (!helper) return res.status(404).json({ error: 'Helper not found' });
    res.json(helper);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// PUT: Update helper details (with optional new photo/KYC)
router.put('/:id', upload.fields([{ name: 'photo' }, { name: 'kyc' }]), async (req, res) => {
  
  try {
    const updateData = {
      employeeCode: req.body.employeeCode?.trim(),
      fullName: req.body.fullName?.trim(),
      serviceType: req.body.serviceType?.trim(),
      organization: req.body.organization?.trim(),
      address: req.body.address?.trim(),
      phone: req.body.phone?.trim(),
      email: req.body.email?.trim(),
      gender: req.body.gender,
      vehicleType: req.body.vehicleType?.trim()
    };

    if (req.body.languages) {
      try {
        updateData.languages = JSON.parse(req.body.languages);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid languages format' });
      }
    }

    if (req.files?.photo) {
      updateData.photoUrl = req.files.photo[0].path;
    }

    if (req.files?.kyc) {
      updateData.kycDocumentUrl = req.files.kyc[0].path;
    }

    const updated = await Helper.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Helper not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove helper by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Helper.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Helper not found' });
    res.json({ message: 'Helper deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;
