"use client";
import { useEffect, useState } from "react";
import LogoutButton from '../../../components/LogoutButton';

export default function InstructorReportsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch instructor's courses
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    }
    fetchCourses();
  }, []);

  const generateReport = async () => {
    if (!selectedCourse) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${selectedCourse}/report`);
      const data = await res.json();
      setReportData(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const csvContent = [
      ["Student Name", "Admission No", "Total Score", "Letter Grade", "GPA Points"],
      ...reportData.students.map(student => [
        `${student.firstName} ${student.lastName}`,
        student.admissionNo,
        student.totalWeighted?.toFixed(2) || 'N/A',
        student.letterGrade || 'N/A',
        student.gpaPoints?.toFixed(2) || 'N/A'
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-report-${selectedCourse}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Course Reports</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2">Select Course</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={generateReport}
            disabled={!selectedCourse || loading}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {reportData && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Course Report: {reportData.course.title}</h2>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Student Name</th>
                  <th className="px-4 py-2 text-left">Admission No</th>
                  <th className="px-4 py-2 text-left">Total Score</th>
                  <th className="px-4 py-2 text-left">Letter Grade</th>
                  <th className="px-4 py-2 text-left">GPA Points</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students.map(student => (
                  <tr key={student.id} className="border-t">
                    <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
                    <td className="px-4 py-2">{student.admissionNo}</td>
                    <td className="px-4 py-2">{student.totalWeighted?.toFixed(2) || 'N/A'}</td>
                    <td className="px-4 py-2 font-semibold">{student.letterGrade || 'N/A'}</td>
                    <td className="px-4 py-2">{student.gpaPoints?.toFixed(2) || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-800">Class Average</h3>
              <p className="text-2xl font-bold text-blue-600">
                {reportData.summary.average?.toFixed(2) || 'N/A'}%
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-800">Pass Rate</h3>
              <p className="text-2xl font-bold text-green-600">
                {reportData.summary.passRate?.toFixed(1) || 'N/A'}%
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-semibold text-purple-800">Total Students</h3>
              <p className="text-2xl font-bold text-purple-600">
                {reportData.students.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
