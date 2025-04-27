const Schedule = require('../database/Schedule');

const createSchedule = async (scheduleData) => {
  try {
    // Clean the schedule data
    const cleanedSchedule = {};
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
      const slots = scheduleData[day]?.filter(slot => slot.time && slot.type) || [];
      if (slots.length > 0) {
        cleanedSchedule[day] = slots.map(slot => {
          const cleanSlot = { time: slot.time, type: slot.type };
          if (slot.type === 'lecture' && slot.lecture?.subject && slot.lecture?.instructor && slot.lecture?.class) {
            cleanSlot.lecture = { ...slot.lecture };
            delete cleanSlot.lab; // Exclude lab when type is lecture
          } else if (slot.type === 'lab' && slot.lab?.length > 0) {
            const validLabs = slot.lab.filter(l => l.subject && l.instructor && l.lab);
            if (validLabs.length > 0) {
              cleanSlot.lab = validLabs;
              delete cleanSlot.lecture; // Exclude lecture when type is lab
            } else {
              return null; // Exclude lab slots with no valid lab entries
            }
          }
          return cleanSlot;
        }).filter(s => s !== null); // Remove null entries (invalid slots)
      }
    });

    // Remove empty days
    Object.keys(cleanedSchedule).forEach(day => {
      if (!cleanedSchedule[day] || cleanedSchedule[day].length === 0) {
        delete cleanedSchedule[day];
      }
    });

    // If no data, return early
    if (Object.keys(cleanedSchedule).length === 0) {
      throw new Error('No valid schedule data provided');
    }

    const existingSchedule = await Schedule.findOne();
    if (existingSchedule) {
      // Update only the provided days
      const updateData = {};
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        if (cleanedSchedule[day]) {
          updateData[day] = cleanedSchedule[day];
        } else {
          updateData[day] = existingSchedule[day] || undefined; // Use undefined to avoid empty arrays
        }
      });
      return await Schedule.findOneAndUpdate({}, updateData, { new: true });
    }

    const schedule = new Schedule(cleanedSchedule);
    return await schedule.save();
  } catch (error) {
    throw new Error('Error creating schedule: ' + error.message);
  }
};

const getSchedule = async () => {
  try {
    const schedule = await Schedule.findOne();
    if (!schedule) {
      return {}; // Return empty object if no schedule exists
    }
    return schedule;
  } catch (error) {
    throw new Error('Error fetching schedule: ' + error.message);
  }
};
module.exports = {
  createSchedule,
  getSchedule
};