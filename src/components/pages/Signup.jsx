import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/layouts/Root";

function Signup() {
  const { isInitialized } = useAuth();
  
  useEffect(() => {
    if (isInitialized && window.ApperSDK) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication-signup");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-blue-600 text-white text-2xl font-bold">
            P
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-2xl font-bold text-gray-900">
              Create Account
            </div>
            <div className="text-center text-sm text-gray-600">
              Join Pipeline Pro to manage your CRM
            </div>
          </div>
        </div>
        <div id="authentication-signup" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-blue-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;