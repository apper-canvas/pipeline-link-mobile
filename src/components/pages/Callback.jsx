import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    if (window.ApperSDK) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSSOVerify("#authentication-callback");
    }
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div id="authentication-callback"></div>
    </div>
  );
};

export default Callback;