"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollToHero = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 flex flex-col items-center justify-start px-2 py-0">
      {/* Hero Section */}
      <section ref={heroRef} className="w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 py-12 px-4 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-lg">
        <div className="max-w-4xl w-full flex flex-col items-center text-center gap-4 z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg tracking-tight mb-2">
            Student Grading Management System
          </h1>
          <p className="text-lg md:text-2xl font-medium mb-4 max-w-2xl mx-auto">
            The most powerful, easy, and customizable grading platform for schools, colleges, and universities. Join a new era of digital education management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto justify-center mt-4">
            <button
              className="flex-1 w-full bg-white/90 text-blue-700 font-bold py-3 rounded-xl shadow-lg hover:bg-blue-100 hover:scale-105 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => router.push('/login?role=INSTRUCTOR')}
            >
              Instructor Portal
            </button>
            <button
              className="flex-1 w-full bg-white/90 text-purple-700 font-bold py-3 rounded-xl shadow-lg hover:bg-purple-100 hover:scale-105 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={() => router.push('/login?role=REGISTRAR')}
            >
              Registrar Portal
            </button>
            <button
              className="flex-1 w-full bg-white/90 text-pink-700 font-bold py-3 rounded-xl shadow-lg hover:bg-pink-100 hover:scale-105 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              onClick={() => router.push('/login?role=STUDENT')}
            >
              Student Portal
            </button>
          </div>
          <p className="text-xs text-white/80 mt-4">* Admin access is available only via the <span className="font-semibold">/admin</span> route.</p>
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl -z-1 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-200/40 rounded-full blur-3xl -z-1 animate-pulse" />
      </section>

      {/* Trusted By Section */}
      <section className="w-full py-6 flex flex-col items-center bg-white">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Trusted by institutions worldwide</h2>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <span className="w-24 h-8 bg-gray-200 rounded shadow-inner flex items-center justify-center text-xs text-gray-500">School A</span>
          <span className="w-24 h-8 bg-gray-200 rounded shadow-inner flex items-center justify-center text-xs text-gray-500">College B</span>
          <span className="w-24 h-8 bg-gray-200 rounded shadow-inner flex items-center justify-center text-xs text-gray-500">University C</span>
          <span className="w-24 h-8 bg-gray-200 rounded shadow-inner flex items-center justify-center text-xs text-gray-500">Academy D</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-4 border-t-4 border-blue-400">
          <h3 className="text-xl font-bold text-blue-700">All-in-One Management</h3>
          <p className="text-gray-600">Student registration, course creation, assessment setup, and grade entry in one place.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-4 border-t-4 border-purple-400">
          <h3 className="text-xl font-bold text-purple-700">Automated Grading</h3>
          <p className="text-gray-600">Automatic grade computation, transcript generation, and reporting for efficiency and accuracy.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-4 border-t-4 border-pink-400">
          <h3 className="text-xl font-bold text-pink-700">Secure & Reliable</h3>
          <p className="text-gray-600">Role-based access, encrypted passwords, and 99% uptime for peace of mind.</p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center">
        <div className="max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-4 border border-slate-100">
          <img src="https://www.eskooly.com/resources/images/shapes/lall.webp" alt="School Head" className="w-16 h-16 rounded-full object-cover border-2 border-blue-400" />
          <p className="text-lg text-gray-700 italic">“SGMS has streamlined our grading and reporting process. It’s reliable, intuitive, and has significantly enhanced our efficiency.”</p>
          <span className="font-semibold text-blue-700">Maheshwari Lall</span>
          <span className="text-sm text-gray-500">School Head | Redhill School, Sandton, SA</span>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-10 flex flex-col items-center bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-4">Ready to Transform Your Institution?</h2>
        <button
          className="bg-gradient-to-r from-blue-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={scrollToHero}
        >
          Get Started Now
        </button>
      </section>
    </main>
  );
}
