"use client";
import { useEffect, useState } from "react";
import LogoutButton from '../../../components/LogoutButton';

export default function StudentTranscriptPage() {
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTranscript() {
      try {
        const res = await fetch("/api/transcript");
        const data = await res.json();
        setTranscript(data);
      } catch (e) {
        setError("Failed to load transcript");
      } finally {
        setLoading(false);
      }
    }
    fetchTranscript();
  }, []);

  const printTranscript = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Academic Transcript</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={printTranscript}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 print:hidden"
          >
            Print Transcript
          </button>
          <LogoutButton />
        </div>
      </div>

      {transcript && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Student Information Header */}
          <div className="border-b-2 border-purple-200 pb-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {transcript.student.firstName} {transcript.student.lastName}
                </h2>
                <p className="text-gray-600">Admission No: {transcript.student.admissionNo}</p>
                <p className="text-gray-600">Program: {transcript.student.courseProgram}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Year of Study: {transcript.student.yearOfStudy}</p>
                <p className="text-gray-600">Status: {transcript.student.status}</p>
                <p className="text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Course Grades */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Course Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="px-4 py-3 text-left border border-purple-200">Course Code</th>
                    <th className="px-4 py-3 text-left border border-purple-200">Course Title</th>
                    <th className="px-4 py-3 text-left border border-purple-200">Credits</th>
                    <th className="px-4 py-3 text-left border border-purple-200">Grade</th>
                    <th className="px-4 py-3 text-left border border-purple-200">Points</th>
                    <th className="px-4 py-3 text-left border border-purple-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transcript.grades.map((grade, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border border-gray-200">{grade.course.code}</td>
                      <td className="px-4 py-3 border border-gray-200">{grade.course.title}</td>
                      <td className="px-4 py-3 border border-gray-200 text-center">{grade.course.credits}</td>
                      <td className="px-4 py-3 border border-gray-200 text-center font-semibold">
                        {grade.letterGrade || 'N/A'}
                      </td>
                      <td className="px-4 py-3 border border-gray-200 text-center">
                        {grade.gpaPoints?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-4 py-3 border border-gray-200 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          grade.totalWeighted >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {grade.totalWeighted >= 50 ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Statistics */}
          {transcript.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t-2 border-purple-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{transcript.summary.totalCourses}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{transcript.summary.passedCourses}</div>
                <div className="text-sm text-gray-600">Courses Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {transcript.summary.overallGPA?.toFixed(2) || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Overall GPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{transcript.summary.totalCredits}</div>
                <div className="text-sm text-gray-600">Total Credits</div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-purple-200 text-center text-sm text-gray-600">
            <p>This transcript is generated electronically and is valid without signature.</p>
            <p>Student Grading Management System (SGMS)</p>
          </div>
        </div>
      )}
    </div>
  );
}