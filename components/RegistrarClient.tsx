"use client";
import { useState, useEffect } from "react";

interface Faculty {
  id: string;
  name: string;
  code: string;
  courses: any[];
}

interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  courseProgram: string;
  status: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  faculty?: any;
}

export default function RegistrarClient() {
  const [view, setView] = useState<"menu"|"students"|"transcripts"|"reports"|"faculties">("menu");
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [transcripts, setTranscripts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  useEffect(() => {
    if (view === "students") {
      fetchStudents();
    } else if (view === "transcripts") {
      fetchTranscripts();
    } else if (view === "reports") {
      fetchReports();
    } else if (view === "faculties") {
      fetchFaculties();
    }
  }, [view]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      console.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscripts = async () => {
    setLoading(true);
    try {
      // Fetch all students and courses
      const [studentsRes, coursesRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/courses")
      ]);
      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();
      setCourses(coursesData);
      
      // Get transcripts for all students
      const transcriptData = [];
      for (const course of coursesData.slice(0, 5)) { // Limit to first 5 courses for performance
        try {
          const reportRes = await fetch(`/api/courses/${course.id}/report`);
          const reportData = await reportRes.json();
          if (reportData.studentsWithGrades) {
            transcriptData.push(...reportData.studentsWithGrades);
          }
        } catch (e) {
          console.error(`Failed to fetch report for course ${course.code}`);
        }
      }
      setTranscripts(Array.from(
        new Map(transcriptData.map(t => [t.id, t])).values()
      ));
    } catch (e) {
      console.error("Failed to load transcripts");
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faculties");
      const data = await res.json();
      setFaculties(data);
    } catch (e) {
      console.error("Failed to load faculties");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Try to fetch comprehensive reports first
      try {
        const reportRes = await fetch("/api/reports/comprehensive");
        const reportData = await reportRes.json();
        
        if (reportData.faculties) {
          const allReports: any[] = [];
          for (const faculty of reportData.faculties) {
            for (const course of faculty.courses) {
              allReports.push({
                id: `${faculty.facultyCode}-${course.code}`,
                code: course.code,
                title: course.title,
                faculty: faculty.facultyName,
                summary: `Instructor: ${course.instructor}, Students: ${course.enrolledStudents}, Avg Score: ${course.averageScore}, Pass Rate: ${course.passRate}%`
              });
            }
          }
          setReports(allReports);
          return;
        }
      } catch (e) {
        console.error("Failed to fetch comprehensive reports");
      }

      // Fallback: Fetch individual course reports
      const res = await fetch("/api/courses");
      const coursesData = await res.json();
      const reportsData: any[] = [];
      
      for (const course of coursesData) {
        try {
          const reportRes = await fetch(`/api/courses/${course.id}/report`);
          const reportData = await reportRes.json();
          reportsData.push({
            id: course.id,
            code: course.code,
            title: course.title,
            summary: `Average Score: ${reportData.summary?.average?.toFixed(2) || 'N/A'}, Pass Rate: ${reportData.summary?.passRate?.toFixed(1) || 'N/A'}%, Students Enrolled: ${reportData.studentsWithGrades?.length || 0}`
          });
        } catch (e) {
          console.error(`Failed to generate report for ${course.code}`);
        }
      }
      setReports(reportsData);
    } catch (e) {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (view === "students") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Student Records</h2>
        <button className="mb-2 px-3 py-1 bg-pink-100 rounded" onClick={() => setView("menu")}>← Back</button>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-pink-50">
                <th className="px-4 py-2 text-left">Admission No</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Program</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2">{s.admissionNo}</td>
                  <td className="px-4 py-2">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.courseProgram}</td>
                  <td className="px-4 py-2">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  if (view === "transcripts") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Student Transcripts</h2>
        <button className="mb-2 px-3 py-1 bg-pink-100 rounded" onClick={() => setView("menu")}>← Back</button>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-pink-50">
                <th className="px-4 py-2 text-left">Admission No</th>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Total Weighted</th>
                <th className="px-4 py-2 text-left">Letter Grade</th>
                <th className="px-4 py-2 text-left">GPA Points</th>
              </tr>
            </thead>
            <tbody>
              {transcripts.map((t: any) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">{t.admissionNo}</td>
                  <td className="px-4 py-2">{t.firstName} {t.lastName}</td>
                  <td className="px-4 py-2">{t.totalWeighted?.toFixed(1) || 'N/A'}</td>
                  <td className="px-4 py-2">{t.letterGrade || 'N/A'}</td>
                  <td className="px-4 py-2">{t.gpaPoints?.toFixed(1) || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  if (view === "reports") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Detailed Course & Faculty Reports</h2>
        <button className="mb-2 px-3 py-1 bg-pink-100 rounded" onClick={() => setView("menu")}>← Back</button>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {reports.length > 0 ? (
              reports.map((r: any) => (
                <div key={r.id} className="bg-white p-4 rounded shadow border-l-4 border-pink-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <b className="text-pink-700">{r.code} - {r.title}</b>
                      {r.faculty && <p className="text-xs text-gray-600">Faculty: {r.faculty}</p>}
                      <p className="text-sm text-gray-600 mt-1">{r.summary}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No reports available</p>
            )}
          </div>
        )}
      </div>
    );
  }
  if (view === "faculties") {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-pink-700">Faculty Data Overview</h2>
        <button className="mb-2 px-3 py-1 bg-pink-100 rounded" onClick={() => setView("menu")}>← Back</button>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {faculties.map((f: any) => (
              <div key={f.id} className="bg-white p-4 rounded shadow border-l-4 border-pink-500">
                <h3 className="font-bold text-pink-700">{f.name} ({f.code})</h3>
                <p className="text-sm text-gray-600">Courses: {f.courses?.length || 0}</p>
                <p className="text-sm text-gray-600">Instructors: {f.users?.length || 0}</p>
              </div>
            ))}
          </div>
        )}
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
      <li className="bg-white p-4 rounded-xl shadow flex justify-between items-center border border-pink-100">
        <span className="font-medium text-gray-800">Faculty Data Overview</span>
        <button className="text-pink-600 hover:underline font-semibold" onClick={() => setView("faculties")}>View</button>
      </li>
    </ul>
  );
}
