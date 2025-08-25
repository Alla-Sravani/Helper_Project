const multer = require('multer');
const path = require('path');

const express = require('express');
const router = express.Router();
const Helper = require('../models/helper.model'); 
const { upload } = require('../utils/uploadTos3');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = file.fieldname === 'photo' ? 'uploads/photos' : 'uploads/kyc';
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = file.fieldname + '-' + Date.now() + ext;
//     cb(null, name);
//   }
// });

 

// POST: Create helper with photo and KYC
router.post('/', upload.fields([{ name: 'photo' }, { name: 'kyc' }]), async (req, res) => {
  try {
    // console.log('Received POST request with files:', req.files);
    // console.log('Received POST request with body:', req.body);
    // if (!req.files || !req.files.photo || !req.files.kyc) {
    //   return res.status(400).json({ error: 'Both photo and KYC document are required' });
    // }
     let photoPath = '';
     let kycPath = '';
    if(req.files?.photo) {
       photoPath = req.files?.photo[0].location || '';
    }

    if(req.files?.kyc && req.files.kyc.length > 0) {
     kycPath = req.files?.kyc[0]?.location || '';

    }
      

  
    // console.log('photoPath files:', photoPath);
    console.log('kycPath files:', kycPath);
    // console.log( req.body);
    req.body.employeeCode = Math.floor(Math.random() * 1000).toString(); // Generate a random employee code
    // console.log()
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

// GET: List all helpers with search, sort, and filter

router.get('/', async (req, res) => {
  console.log('Received GET request with query:', req.query);
  try {
    let {
      search = '',
      sortBy = 'fullName',
      order = 'asc',
      service = '',
      organization = ''
    } = req.query;

    const sortDirection = order === 'asc' ? 1 : -1;
    const matchConditions = {};

    // Search
    if (search) {
      matchConditions.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } }
      ];
    }

    // Convert comma-separated strings to arrays
    const serviceArray = service ? service.split(',') : [];
    const organizationArray = organization ? organization.split(',') : [];

    // Filter by services
    if (serviceArray.length > 0) {
      matchConditions.serviceType = { $in: serviceArray };
    }

    // Filter by organizations
    if (organizationArray.length > 0) {
      matchConditions.organization = { $in: organizationArray };
    }

    const lowerSortField = 'sortField';

    const result = await Helper.aggregate([
      { $match: matchConditions },
      {
        $addFields: {
          [lowerSortField]: {
            $toLower: `$${sortBy}`
          }
        }
      },
      {
        $facet: {
          data: [
            { $sort: { [lowerSortField]: sortDirection } },
            { $project: { [lowerSortField]: 0 } }
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
    console.error('Aggregation error:', err);
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
      updateData.photoUrl = req.files?.photo[0]?.location;
    }

    if (req.files?.kyc) {
      updateData.kycDocumentUrl = req.files?.kyc[0]?.location;
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
