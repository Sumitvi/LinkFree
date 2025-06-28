import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const username = localStorage.getItem("username");

export default function DashboardContacts() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/contact/${username}`)
      .then(res => res.json())
      .then(setSubmissions);
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:8080/api/contact/${id}`, {
        method: "DELETE",
      });

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contact Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul className="space-y-2">
          {submissions.map((s) => (
            <li key={s.id} className="p-3 bg-white shadow rounded relative">
              <p><strong>Email:</strong> {s.email}</p>
              <p><strong>Phone:</strong> {s.phone}</p>
              <p>
                <strong>Submitted:</strong>{" "}
                {s.createdAt
                  ? new Date(s.createdAt.split(".")[0]).toLocaleString()
                  : "N/A"}
              </p>
                <button
                onClick={() => handleDelete(s.id)}
                className="text-red-600 hover:text-red-800 right-5 absolute top-5"
                title="Delete"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
