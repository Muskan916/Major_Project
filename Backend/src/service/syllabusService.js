// backend/services/syllabusService.js
const Syllabus = require('../database/Syllabus');
const Class = require('../database/Class');

class SyllabusService {
  // Fetch all classes
  async getClasses() {
    try {
      const classes = await Class.find().select('name');
      return classes.map(cls => cls.name);
    } catch (error) {
      throw new Error(`Failed to fetch classes: ${error.message}`);
    }
  }

  // Create a new syllabus
  async createSyllabus(syllabusData) {
    try {
      const { className, courseName, subject, topics, startDate, endDate } = syllabusData;
      if (!className || !courseName || !subject || !topics || !startDate || !endDate) {
        throw new Error('All fields are required');
      }

      // Validate className exists (optional, depending on your needs)
      const classExists = await Class.findOne({ name: className });
      if (!classExists) {
        throw new Error(`Class '${className}' does not exist`);
      }

      const syllabus = new Syllabus({
        className,
        courseName,
        subject,
        topics,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
      await syllabus.save();
      return { message: `Syllabus created for ${className}`, _id: syllabus._id };
    } catch (error) {
      throw new Error(`Failed to create syllabus: ${error.message}`);
    }
  }

  // Fetch all syllabi
  async getSyllabi() {
    try {
      return await Syllabus.find();
    } catch (error) {
      throw new Error(`Failed to fetch syllabi: ${error.message}`);
    }
  }

  // Update a syllabus
  async updateSyllabus(id, updatedData) {
    try {
      const { className, courseName, subject, topics, startDate, endDate } = updatedData;
      if (!className || !courseName || !subject || !topics || !startDate || !endDate) {
        throw new Error('All fields are required');
      }

      const syllabus = await Syllabus.findByIdAndUpdate(
        id,
        {
          className,
          courseName,
          subject,
          topics,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
        { new: true, runValidators: true }
      );
      if (!syllabus) {
        throw new Error('Syllabus not found');
      }
      return { message: 'Syllabus updated successfully', syllabus };
    } catch (error) {
      throw new Error(`Failed to update syllabus: ${error.message}`);
    }
  }

  // Delete a syllabus
  async deleteSyllabus(id) {
    try {
      const syllabus = await Syllabus.findByIdAndDelete(id);
      if (!syllabus) {
        throw new Error('Syllabus not found');
      }
      return { message: 'Syllabus deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete syllabus: ${error.message}`);
    }
  }
}

module.exports = new SyllabusService();