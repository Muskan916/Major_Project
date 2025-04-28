// backend/controllers/syllabusController.js
const syllabusService = require('../service/syllabusService');

class SyllabusController {
  // Fetch all classes
  async getClasses(req, res) {
    try {
      const classes = await syllabusService.getClasses();
      res.status(200).json({ classes });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create a new syllabus
  async createSyllabus(req, res) {
    try {
      const syllabusData = req.body;
      const result = await syllabusService.createSyllabus(syllabusData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Fetch all syllabi
  async getSyllabi(req, res) {
    try {
      const syllabi = await syllabusService.getSyllabi();
      res.status(200).json(syllabi);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update a syllabus
  async updateSyllabus(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await syllabusService.updateSyllabus(id, updatedData);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a syllabus
  async deleteSyllabus(req, res) {
    try {
      const { id } = req.params;
      const result = await syllabusService.deleteSyllabus(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new SyllabusController();