'use client';

import { useEffect, useState } from 'react';

interface StatsSummary {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
}

interface CourseReport {
  code: string;
  title: string;
  enrolledStudents: number;
  assessments: number;
  averageScore: string;
  passRate: string;
}

interface FacultyReport {
  facultyName: string;
  facultyCode: string;
  totalCourses: number;
  totalInstructors: number;
  totalStudents: number;
  averageGPA: string;
  overallPassRate: string;
  courses: CourseReport[];
}

interface DataShape {
  generatedAt: string;
  totalFaculties: number;
  faculties: FacultyReport[];
  summary: StatsSummary;
}

export default function AdminReportsClient({ initialData }: { initialData: DataShape }) {
  const [reportData, setReportData] = useState<DataShape | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/comprehensive', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadReport();
    }, 15000);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('sgms-grade-updates');
      channel.onmessage = () => {
        loadReport();
      };
    }

    return () => {
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, []);

  if (!reportData) {
    return <div className="p-8">Loading report data...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">System Reports (Live)</h1>
        <button
          onClick={loadReport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold">{reportData.summary.totalStudents}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Total Courses</p>
          <p className="text-2xl font-bold">{reportData.summary.totalCourses}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Total Instructors</p>
          <p className="text-2xl font-bold">{reportData.summary.totalInstructors}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Last updated: {new Date(reportData.generatedAt).toLocaleString()}</p>
      {reportData.faculties.map(faculty => (
        <section key={faculty.facultyCode} className="bg-white rounded shadow mb-4 p-4">
          <h2 className="text-xl font-semibold">{faculty.facultyName} ({faculty.facultyCode})</h2>
          <p className="text-sm text-gray-600 mb-3">Students: {faculty.totalStudents} • Courses: {faculty.totalCourses} • Instructors: {faculty.totalInstructors} • GPA: {faculty.averageGPA} • Pass Rate: {faculty.overallPassRate}%</p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1">Course</th>
                  <th className="px-2 py-1">Enrolled</th>
                  <th className="px-2 py-1">Assessments</th>
                  <th className="px-2 py-1">Average Score</th>
                  <th className="px-2 py-1">Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {faculty.courses.map(course => (
                  <tr key={course.code} className="border-t">
                    <td className="px-2 py-1">{course.code} {course.title}</td>
                    <td className="px-2 py-1">{course.enrolledStudents}</td>
                    <td className="px-2 py-1">{course.assessments}</td>
                    <td className="px-2 py-1">{course.averageScore}</td>
                    <td className="px-2 py-1">{course.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
