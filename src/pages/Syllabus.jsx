import React, { useState, useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';

const AddSyllabus = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    courseName: '',
    subject: '',
    topics: '',
    startDate: '',
    endDate: '',
  });
  const [classes, setClasses] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch classes and syllabi on mount
  useEffect(() => {
    const fetchClasses = async () => {
      setClassesLoading(true);
      try {
        const response = await fetch('http://192.168.15.47:5000/api/V1/syllabus/classes');
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        if (data.classes) {
          setClasses(data.classes);
        } else {
          setError('No classes found');
        }
      } catch (err) {
        setError('Error fetching classes: ' + err.message);
      } finally {
        setClassesLoading(false);
      }
    };

    const fetchSyllabi = async () => {
      try {
        const response = await fetch('http://192.168.15.47:5000/api/V1/syllabus');
        if (!response.ok) {
          throw new Error('Failed to fetch syllabi');
        }
        const data = await response.json();
        setSyllabi(data);
      } catch (err) {
        setError('Error fetching syllabi: ' + err.message);
      }
    };

    fetchClasses();
    fetchSyllabi();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const url = editingId
        ? `http://192.168.15.47:5000/api/V1/syllabus/${editingId}`
        : 'http://192.168.15.47:5000/api/V1/syllabus';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to save syllabus');
      }
      const result = await response.json();

      if (editingId) {
        setSyllabi(syllabi.map(syllabus => (syllabus._id === editingId ? { ...syllabus, ...formData } : syllabus)));
        setEditingId(null);
      } else {
        setSyllabi([...syllabi, { ...formData, _id: result._id }]);
      }

      setMessage(result.message || (editingId ? 'Syllabus updated successfully' : 'Syllabus added successfully'));
      setFormData({ className: '', courseName: '', subject: '', topics: '', startDate: '', endDate: '' });
    } catch (error) {
      setError(`Error ${editingId ? 'updating' : 'adding'} syllabus: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (syllabus) => {
    setFormData({
      className: syllabus.className,
      courseName: syllabus.courseName,
      subject: syllabus.subject,
      topics: syllabus.topics,
      startDate: syllabus.startDate.split('T')[0],
      endDate: syllabus.endDate.split('T')[0],
    });
    setEditingId(syllabus._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://192.168.15.47:5000/api/V1/syllabus/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete syllabus');
      }
      const result = await response.json();
      setSyllabi(syllabi.filter(syllabus => syllabus._id !== id));
      setMessage(result.message || 'Syllabus deleted successfully');
    } catch (error) {
      setError(`Error deleting syllabus: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl text-white"
          >
            ×
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="/dashboard"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-calendar"></i>
            <span>Calendar</span>
          </a>
          <a
            href="/schedule"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-clock"></i>
            <span>Schedule</span>
          </a>
          <a
            href="/view-schedule"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-eye"></i>
            <span>View Schedule</span>
          </a>
          <a
            href="/attendance"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-check-circle"></i>
            <span>Attendance</span>
          </a>
          <a
            href="/add-syllabus"
            className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500 transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>Add Syllabus</span>
          </a>
          <div className="p-3">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between lg:justify-start">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-blue-600 text-2xl"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="flex items-center justify-center flex-1">
            <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto mr-4" />
            <span className="text-3xl font-bold text-gray-800">Manage Syllabus</span>
            <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto ml-4" />
          </div>
        </header>

        {/* Syllabus Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{editingId ? 'Edit Syllabus' : 'Add New Syllabus'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Class</label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={loading || classesLoading}
                >
                  <option value="" disabled>
                    {classesLoading ? 'Loading classes...' : '-- Select Class --'}
                  </option>
                  {classes.map((className, index) => (
                    <option key={index} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
                {error && classes.length === 0 && !classesLoading && (
                  <p className="mt-1 text-red-600 text-sm">{error}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Topics</label>
                <textarea
                  name="topics"
                  value={formData.topics}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="3"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-lg transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingId ? 'Update Syllabus' : 'Add Syllabus')}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ className: '', courseName: '', subject: '', topics: '', startDate: '', endDate: '' });
                  }}
                  className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </form>

            {/* Syllabus List */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Syllabi</h2>
            {syllabi.length === 0 ? (
              <p className="text-gray-600">No syllabi found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Class</th>
                      <th className="px-4 py-2 border">Course</th>
                      <th className="px-4 py-2 border">Subject</th>
                      <th className="px-4 py-2 border">Topics</th>
                      <th className="px-4 py-2 border">Start Date</th>
                      <th className="px-4 py-2 border">End Date</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syllabi.map((syllabus) => (
                      <tr key={syllabus._id} className="border-t">
                        <td className="px-4 py-2 border">{syllabus.className}</td>
                        <td className="px-4 py-2 border">{syllabus.courseName}</td>
                        <td className="px-4 py-2 border">{syllabus.subject}</td>
                        <td className="px-4 py-2 border">{syllabus.topics}</td>
                        <td className="px-4 py-2 border">{new Date(syllabus.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 border">{new Date(syllabus.endDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => handleEdit(syllabus)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(syllabus._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(message || error) && <p className={`mt-4 ${message ? 'text-green-600' : 'text-red-600'}`}>{message || error}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddSyllabus;