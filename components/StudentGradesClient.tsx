"use client";
import { useEffect, useState } from "react";

export default function StudentGradesClient() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGrades() {
      setLoading(true);
      try {
        const res = await fetch("/api/grade-entries");
        const data = await res.json();
        setGrades(data);
      } catch (e) {
        setError("Failed to load grades");
      } finally {
        setLoading(false);
      }
    }
    fetchGrades();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-blue-700">My Grades</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : grades.length === 0 ? (
        <div className="text-center text-gray-500">No grades found.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Assessment</th>
              <th className="px-4 py-2">Marks</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(entry => (
              <tr key={entry.id} className="border-t">
                <td className="px-4 py-2">{entry.assessment?.name}</td>
                <td className="px-4 py-2">{entry.marks}</td>
                <td className="px-4 py-2">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
