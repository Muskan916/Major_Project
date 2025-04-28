const express = require('express');
const router = express.Router();
const syllabusController = require('../controller/syllabusController');
const fileUpload = require('express-fileupload');

router.get('/classes', syllabusController.getClasses);
router.post('/', syllabusController.createSyllabus);
router.get('/', syllabusController.getSyllabi);
router.put('/:id', syllabusController.updateSyllabus);
router.delete('/:id', syllabusController.deleteSyllabus);

module.exports = router;