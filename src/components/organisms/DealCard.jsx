import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const DealCard = ({ deal, contact, onDragStart, onDragEnd, isDragging }) => {
  const getDaysInStage = () => {
    const days = Math.floor((new Date() - new Date(deal.updatedAt)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const stageColors = {
    discovery: "border-l-blue-500",
    qualified: "border-l-purple-500",
    proposal: "border-l-amber-500",
    negotiation: "border-l-green-500"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={isDragging ? "opacity-50" : ""}
    >
      <Card 
        className={`p-4 cursor-move border-l-4 ${stageColors[deal.stage] || "border-l-gray-300"} hover:shadow-md transition-shadow duration-200`}
      >
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">{deal.title}</h4>
            <p className="text-sm text-secondary">{contact?.name || "Unknown Contact"}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${deal.value.toLocaleString()}
            </span>
            <span className="text-xs text-secondary bg-gray-100 px-2 py-1 rounded">
              {deal.probability}% likely
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-secondary">
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={12} />
              <span>{getDaysInStage()} days in stage</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={12} />
              <span>{format(new Date(deal.expectedCloseDate), "MMM d")}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;