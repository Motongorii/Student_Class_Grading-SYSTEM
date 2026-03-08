"use client";
import { useState } from "react";

export default function RegistrarClient() {
  const [view, setView] = useState<"menu"|"students"|"transcripts"|"reports">("menu");

  // Placeholder data and logic for demonstration
  // In a real app, fetch from API
  const students = [
    { id: "1", firstName: "Alice", lastName: "Smith", admissionNo: "A001" },
    { id: "2", firstName: "Bob", lastName: "Johnson", admissionNo: "A002" },
  ];
  const transcripts = [
    { id: "1", student: "Alice Smith", gpa: 3.8 },
    { id: "2", student: "Bob Johnson", gpa: 3.5 },
  ];
  const reports = [
    { id: "1", title: "Class Performance", summary: "Average GPA: 3.65" },
  ];

  if (view === "students") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Student Records</h2>
        <button className="mb-2 px-3 py-1 bg-pink-100 rounded" onClick={() => setView("menu")}>← Back</button>
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr><th>Admission No</th><th>Name</th></tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}><td>{s.admissionNo}</td><td>{s.firstName} {s.lastName}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (view === "transcripts") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Transcripts</h2>
        <button className="mb-2 px-3 py-1 bg-pink-100 rounded" onClick={() => setView("menu")}>← Back</button>
        <table className="min-w-full bg-white rounded shadow">
          <thead><tr><th>Student</th><th>GPA</th></tr></thead>
          <tbody>
            {transcripts.map(t => (
              <tr key={t.id}><td>{t.student}</td><td>{t.gpa}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (view === "reports") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Class Reports</h2>
        <button className="mb-2 px-3 py-1 bg-pink-100 rounded" onClick={() => setView("menu")}>← Back</button>
        <ul className="list-disc pl-6">
          {reports.map(r => (
            <li key={r.id}><b>{r.title}:</b> {r.summary}</li>
          ))}
        </ul>
      </div>
    );
  }
  // Main menu
  return (
    <ul className="space-y-4 w-full">
      <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-pink-100">
        <span className="font-medium text-gray-800">Manage Student Records</span>
        <button className="text-pink-600 hover:underline font-semibold" onClick={() => setView("students")}>Manage</button>
      </li>
      <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-pink-100">
        <span className="font-medium text-gray-800">Generate Transcripts</span>
        <button className="text-pink-600 hover:underline font-semibold" onClick={() => setView("transcripts")}>Generate</button>
      </li>
      <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-pink-100">
        <span className="font-medium text-gray-800">View Class Reports</span>
        <button className="text-pink-600 hover:underline font-semibold" onClick={() => setView("reports")}>View</button>
      </li>
    </ul>
  );
}
