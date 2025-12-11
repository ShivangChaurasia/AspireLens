export default function VerifyEmailInfo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-6">
          We have sent a verification link to your email.
          Please check your inbox and click the link to activate your account.
        </p>
        <p className="text-sm text-gray-500">
          Didn’t receive the email? Check spam or try again.
        </p>
      </div>
    </div>
  );
}
