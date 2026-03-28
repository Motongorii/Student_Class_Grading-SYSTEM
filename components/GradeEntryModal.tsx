"use client";
import { useState } from "react";

export default function GradeEntryModal({ open, onClose, onSubmit, students, assessments }) {
  const [studentId, setStudentId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [marks, setMarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const numericMarks = parseFloat(marks);
    if (Number.isNaN(numericMarks) || numericMarks < 0) {
      setError("Please enter a valid mark greater than or equal to 0.");
      setLoading(false);
      return;
    }

    try {
      await onSubmit({ studentId, assessmentId, marks: numericMarks });
      setStudentId("");
      setAssessmentId("");
      setMarks("");
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to submit grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-purple-700">Enter Grade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Student</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
            >
              <option value="">Select student</option>
              {(Array.isArray(students) ? students : []).map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Assessment</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={assessmentId}
              onChange={e => setAssessmentId(e.target.value)}
              required
            >
              <option value="">Select assessment</option>
              {assessments.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Marks</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={marks}
              onChange={e => setMarks(e.target.value)}
              min={0}
              step={0.01}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Grade"}
          </button>
        </form>
      </div>
    </div>
  );
}
