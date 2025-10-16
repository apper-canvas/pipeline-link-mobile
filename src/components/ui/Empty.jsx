import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, message, actionLabel, onAction, icon = "Inbox" }) => {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title || "No data yet"}
          </h3>
          <p className="text-secondary text-sm">
            {message || "Get started by adding your first item."}
          </p>
        </div>
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all duration-200 flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;