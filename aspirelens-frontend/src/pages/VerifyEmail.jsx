import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [params] = useSearchParams();

  const token = params.get("token");

  useEffect(() => {
    async function verify() {
      try {
        await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}`,
          { withCredentials: false }
        );

        // ⛔ IMPORTANT:
        // Do NOT navigate here. Backend will handle redirect.
        setStatus("success");

        // Let backend redirect the whole browser window.
        window.location.href = "/email-verified";

      } catch (error) {
        console.error(error.response?.data);
        setStatus("error");
      }
    }

    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">

        {status === "verifying" && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Verifying email...</h2>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-3">Email Verified 🎉</h2>
            <p className="text-gray-600">Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-3">Verification Failed ❌</h2>
            <p className="text-gray-600 mb-4">The link may have expired or is invalid.</p>

            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Go to Login
            </a>
          </>
        )}

      </div>
    </div>
  );
}
