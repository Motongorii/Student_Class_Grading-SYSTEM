"use client";
import { useState } from "react";

export default function AssessmentCreateModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          weight: Number(weight),
          maxMarks: Number(maxMarks),
          courseId: undefined // Will be set by backend or instructor context
        }),
      });
      if (!res.ok) throw new Error("Failed to create assessment");
      setName("");
      setWeight("");
      setMaxMarks("");
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create assessment");
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
        <h2 className="text-xl font-bold mb-4 text-purple-700">Create Assessment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Weight (%)</label>
            <input className="w-full border rounded px-3 py-2" type="number" value={weight} onChange={e => setWeight(e.target.value)} required min={1} max={100} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Max Marks</label>
            <input className="w-full border rounded px-3 py-2" type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} required min={1} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded font-semibold shadow hover:bg-purple-700" disabled={loading}>
            {loading ? "Saving..." : "Create Assessment"}
          </button>
        </form>
      </div>
    </div>
  );
}
