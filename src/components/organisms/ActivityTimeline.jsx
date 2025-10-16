import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ActivityTimeline = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "email":
        return "Mail";
      case "call":
        return "Phone";
      case "meeting":
        return "Users";
      default:
        return "MessageSquare";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-600";
      case "call":
        return "bg-green-100 text-green-600";
      case "meeting":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="flex gap-4"
        >
          <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
            <ApperIcon name={getActivityIcon(activity.type)} size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-gray-900 capitalize">
                {activity.type}
              </p>
              <span className="text-xs text-secondary whitespace-nowrap">
                {format(new Date(activity.timestamp), "MMM d, h:mm a")}
              </span>
            </div>
            <p className="text-sm text-secondary">{activity.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityTimeline;