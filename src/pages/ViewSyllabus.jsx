import React, { useState, useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';
import Sidebar from '../components/Sidebar';


const ViewSyllabus = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch syllabi on mount
  useEffect(() => {
    const fetchSyllabi = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.255.47:5000/api/V1/syllabus');
        if (!response.ok) {
          throw new Error('Failed to fetch syllabi');
        }
        const data = await response.json();
        setSyllabi(data);
      } catch (err) {
        setError('Error fetching syllabi: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabi();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePath="/view-syllabus" />


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
            <span className="text-3xl font-bold text-gray-800">View Syllabus</span>
            <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto ml-4" />
          </div>
        </header>

        {/* Syllabus Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Syllabi</h2>
            {loading ? (
              <p className="text-gray-600">Loading syllabi...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : syllabi.length === 0 ? (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewSyllabus;