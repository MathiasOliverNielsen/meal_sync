"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useLogout } from "@/hooks/useAuth";

interface ProtectedData {
  message: string;
  user: any;
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const [protectedData, setProtectedData] = useState<ProtectedData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [user, authLoading, router]);

  const fetchProtectedData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      const response = await fetch("/api/protected/example", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch protected data");
      }

      const data = await response.json();
      setProtectedData(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user.username}!</p>
          </div>
          <button onClick={handleLogout} disabled={logoutLoading} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
            {logoutLoading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 font-semibold">Username</p>
              <p className="text-gray-900 text-lg">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Email</p>
              <p className="text-gray-900 text-lg">{user.email}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 font-semibold">User ID</p>
              <p className="text-gray-900 font-mono text-sm break-all">{user.id}</p>
            </div>
          </div>
        </div>

        {/* Protected Data Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Protected API Endpoint</h2>
          <p className="text-gray-600 mb-6">This section demonstrates calling a protected API endpoint that requires authentication.</p>

          <button
            onClick={fetchProtectedData}
            disabled={loadingData}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 mb-6"
          >
            {loadingData ? "Loading..." : "Call Protected Endpoint"}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {protectedData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-3">Response:</h3>
              <div className="bg-white rounded p-4 font-mono text-sm overflow-auto">
                <pre>{JSON.stringify(protectedData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
