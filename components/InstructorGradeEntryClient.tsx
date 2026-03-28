"use client";
import { useEffect, useState } from "react";
import GradeEntryModal from "./GradeEntryModal";
import dynamic from 'next/dynamic';
const AssessmentCreateModal = dynamic(() => import('./AssessmentCreateModal'), { ssr: false });

export default function InstructorGradeEntryClient() {
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState([]);

  async function fetchData() {
    setLoading(true);
    try {
      const [studentsRes, assessmentsRes, entriesRes] = await Promise.all([
        fetch("/api/students").then(r => r.json()),
        fetch("/api/assessments").then(r => r.json()),
        fetch("/api/grade-entries").then(r => r.json()),
      ]);
      setStudents(Array.isArray(studentsRes) ? studentsRes : []);
      setAssessments(Array.isArray(assessmentsRes) ? assessmentsRes : []);
      setEntries(Array.isArray(entriesRes) ? entriesRes : []);
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { fetchData(); }, []);

  async function handleSubmit({ studentId, assessmentId, marks }) {
    const res = await fetch("/api/grade-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, assessmentId, marks }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const message =
        (errorData && (errorData.error || errorData.message)) ||
        `Failed to save grade (HTTP ${res.status})`;
      throw new Error(message);
    }

    const newEntry = await res.json();
    setEntries((e) => [newEntry, ...e]);

    // Broadcast a grade update event to sibling tabs/components (student side)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('sgms-grade-updates');
      channel.postMessage({ type: 'GRADE_CREATED', payload: newEntry });
      channel.close();
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 gap-2">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-purple-700"
          onClick={() => setShowModal(true)}
        >
          + Enter Grade
        </button>
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-pink-700"
          onClick={() => setShowAssessmentModal(true)}
        >
          + Create Assessment
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">Assessment</th>
              <th className="px-4 py-2">Marks</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id} className="border-t">
                <td className="px-4 py-2">{entry.student?.firstName} {entry.student?.lastName}</td>
                <td className="px-4 py-2">{entry.assessment?.name}</td>
                <td className="px-4 py-2">{entry.marks}</td>
                <td className="px-4 py-2">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <GradeEntryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        students={students}
        assessments={assessments}
      />
      <AssessmentCreateModal
        open={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onCreated={async () => {
          await fetchData();
          if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            const channel = new BroadcastChannel('sgms-grade-updates');
            channel.postMessage({ type: 'ASSESSMENT_CREATED' });
            channel.close();
          }
        }}
      />
    </div>
  );
}
