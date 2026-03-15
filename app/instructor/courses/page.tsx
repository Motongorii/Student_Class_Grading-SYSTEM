import LogoutButton from '../../../components/LogoutButton';

export default function InstructorCoursesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <LogoutButton />
      </div>
      <p>This is a placeholder for the instructor's courses list.</p>
    </div>
  );
}
