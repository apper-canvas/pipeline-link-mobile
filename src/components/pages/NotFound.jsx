import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" className="text-white" size={48} />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-secondary mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Home" size={18} />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;