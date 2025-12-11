export default function EmailVerified() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Email Verified 🎉</h2>
        <p className="text-gray-600 mb-6">
          Your account has been successfully activated.
          You can now log in and start using AspireLens.
        </p>

        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Go to Login
        </a>

      </div>
    </div>
  );
}
