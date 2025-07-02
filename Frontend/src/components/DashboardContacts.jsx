import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import FlashMessage from '../components/FlashMessage'; // ✅ Adjust if needed

const username = localStorage.getItem("username");

export default function DashboardContacts() {
  const [submissions, setSubmissions] = useState([]);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/contact/${username}`)
      .then(res => res.json())
      .then(setSubmissions)
      .catch(() => {
        setFlash({ type: 'error', message: '❌ Failed to load submissions' });
      });
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:8080/api/contact/${id}`, {
        method: "DELETE",
      });

      setSubmissions(prev => prev.filter(s => s.id !== id));
      setFlash({ type: 'success', message: '✅ Contact deleted successfully!' });
    } catch (error) {
      console.error("Error deleting contact:", error);
      setFlash({ type: 'error', message: '❌ Error deleting contact' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">📩 Contact Submissions</h2>

      {flash && <FlashMessage type={flash.type} message={flash.message} />}

      {submissions.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No submissions yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="border-l-4 border-orange-400 rounded-xl p-8 bg-gradient-to-b from-white to-orange-50 shadow-md hover:shadow-xl transition-all duration-300 relative"
            >
              <button
                onClick={() => handleDelete(s.id)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                title="Delete contact"
              >
                <FaTrash size={18} />
              </button>

              <p className="text-sm text-gray-800 mb-1"><strong>Email:</strong> {s.email}</p>
              <p className="text-sm text-gray-800 mb-1"><strong>Phone:</strong> {s.phone}</p>
              <p className="text-xs text-gray-500 mt-3">
                <strong>Submitted:</strong>{" "}
                {s.createdAt
                  ? new Date(s.createdAt.split(".")[0]).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
