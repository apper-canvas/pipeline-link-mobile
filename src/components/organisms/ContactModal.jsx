import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import ActivityTimeline from "./ActivityTimeline";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";

const ContactModal = ({ contact, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && contact) {
      loadContactData();
    }
  }, [isOpen, contact]);

  const loadContactData = async () => {
    setLoading(true);
    try {
      const [contactDeals, contactActivities] = await Promise.all([
        dealService.getByContactId(contact.Id),
        activityService.getByContactId(contact.Id)
      ]);
      setDeals(contactDeals);
      setActivities(contactActivities);
    } catch (error) {
      console.error("Failed to load contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !contact) return null;

  const tabs = [
    { id: "info", label: "Info", icon: "User" },
    { id: "deals", label: "Deals", icon: "TrendingUp" },
    { id: "activity", label: "Activity", icon: "Activity" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <Card className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {contact.name}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-secondary text-sm">{contact.company}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={contact.status} />
                      {contact.tags && contact.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} className="text-secondary" />
                </button>
              </div>

              <div className="flex gap-2 mt-4 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors duration-200 relative ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-secondary hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon name={tab.icon} size={16} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeModalTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Mail" size={16} className="text-secondary" />
                        <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
                        Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Phone" size={16} className="text-secondary" />
                        <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
                        Last Contact
                      </label>
                      <p className="text-sm text-gray-900">
                        {format(new Date(contact.lastContactDate), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
                        Created
                      </label>
                      <p className="text-sm text-gray-900">
                        {format(new Date(contact.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  {contact.notes && (
                    <div>
                      <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
                        Notes
                      </label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {contact.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "deals" && (
                <div className="space-y-3">
                  {loading ? (
                    <p className="text-center text-secondary py-8">Loading deals...</p>
                  ) : deals.length === 0 ? (
                    <p className="text-center text-secondary py-8">No deals found</p>
                  ) : (
                    deals.map((deal) => (
                      <Card key={deal.Id} className="p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {deal.title}
                            </h4>
                            <p className="text-sm text-secondary capitalize mb-2">
                              Stage: {deal.stage}
                            </p>
                            <p className="text-xs text-secondary">
                              Expected close: {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              ${deal.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-secondary mt-1">
                              {deal.probability}% likely
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  {loading ? (
                    <p className="text-center text-secondary py-8">Loading activities...</p>
                  ) : activities.length === 0 ? (
                    <p className="text-center text-secondary py-8">No activities found</p>
                  ) : (
                    <ActivityTimeline activities={activities} />
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;