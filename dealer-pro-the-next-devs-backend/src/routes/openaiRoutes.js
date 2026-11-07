const express = require('express');
const router = express.Router();
  
const { generateAIResponse , generateReplicateImage , generateOpenAIText} = require('../controllers/OpenaiController');
const upload = require('../services/pdfUpload'); // multer config

router.post('/generate-image', upload.single('file'), generateAIResponse);
router.post('/generateReplicateImage', generateReplicateImage);
router.post('/generateOpenAIText',   generateOpenAIText);

module.exports = router;
