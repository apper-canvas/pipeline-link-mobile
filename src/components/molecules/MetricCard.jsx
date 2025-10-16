import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colors = {
    primary: "text-primary bg-blue-50",
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    accent: "text-accent bg-amber-50"
  };

  const trendColors = {
    up: "text-green-600 bg-green-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trendColors[trend]}`}>
                  <ApperIcon 
                    name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                    size={12}
                  />
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;