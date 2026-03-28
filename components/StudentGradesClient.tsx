"use client";
import { useEffect, useState } from "react";

export default function StudentGradesClient() {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    let pollingTimer: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [gradesRes, coursesRes] = await Promise.all([
          fetch("/api/grade-entries"),
          fetch("/api/students/enrollments")
        ]);

        if (!gradesRes.ok || !coursesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const gradesData = await gradesRes.json();
        const enrollmentData = await coursesRes.json();

        setGrades(gradesData);
        if (enrollmentData.enrolledCourses) {
          setCourses(enrollmentData.enrolledCourses);
          if (!selectedCourse && enrollmentData.enrolledCourses.length > 0) {
            setSelectedCourse(enrollmentData.enrolledCourses[0].id);
          }
        }

        setError("");
      } catch (e) {
        setError("Failed to load grades");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll every 8 seconds for new grade entries
    pollingTimer = setInterval(fetchData, 8000);

    // BroadcastChannel for real-time sync across tabs
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('sgms-grade-updates');
      channel.onmessage = (event) => {
        if (event.data?.type === 'GRADE_CREATED' || event.data?.type === 'ASSESSMENT_CREATED') {
          fetchData();
        }
      };
    }

    return () => {
      if (pollingTimer) clearInterval(pollingTimer);
      if (channel) channel.close();
    };
  }, [selectedCourse]);

  // Filter grades by selected course
  const filteredGrades = selectedCourse
    ? grades.filter((g: any) => g.assessment?.course?.id === selectedCourse)
    : grades;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-blue-700">My Grades</h2>
      
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-gray-500">No enrolled courses found.</div>
      ) : (
        <>
          {/* Course Filter */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Course:</label>
            <select
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Grades Table */}
          {filteredGrades.length === 0 ? (
            <div className="text-center text-gray-500">No grades for this course yet.</div>
          ) : (
            <table className="min-w-full bg-white rounded shadow border border-gray-200">
              <thead>
                <tr className="bg-blue-50 border-b">
                  <th className="px-4 py-2 text-left text-sm font-semibold">Course</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Assessment</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold">Marks</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((entry: any) => (
                  <tr key={entry.id} className="border-t hover:bg-blue-50">
                    <td className="px-4 py-2 text-sm">{entry.assessment?.course?.code}</td>
                    <td className="px-4 py-2 text-sm">{entry.assessment?.name}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{entry.marks.toFixed(1)}</td>
                    <td className="px-4 py-2 text-sm text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        entry.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
