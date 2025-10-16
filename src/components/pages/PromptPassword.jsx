import { useEffect } from 'react';

const PromptPassword = () => {
    useEffect(() => {
        if (window.ApperSDK) {
            const { ApperUI } = window.ApperSDK;
            ApperUI.showPromptPassword('#authentication-prompt-password');
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl">
                <div id="authentication-prompt-password"></div>
            </div>
        </div>
    );
};

export default PromptPassword;