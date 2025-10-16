import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getRecent(5)
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = deals.filter(d => d.stage !== "closed");
  const avgDealSize = activeDeals.length > 0 ? totalPipelineValue / activeDeals.length : 0;
  const conversionRate = 65;

  const getActivityIcon = (type) => {
    switch (type) {
      case "email": return "Mail";
      case "call": return "Phone";
      case "meeting": return "Users";
      default: return "MessageSquare";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "email": return "bg-blue-100 text-blue-600";
      case "call": return "bg-green-100 text-green-600";
      case "meeting": return "bg-purple-100 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-secondary">Track your sales performance and activity</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate("/contacts")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Users" size={18} />
            View Contacts
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/pipeline")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="TrendingUp" size={18} />
            Pipeline
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Deals"
          value={activeDeals.length}
          icon="Briefcase"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(totalPipelineValue / 1000).toFixed(0)}K`}
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+8%"
        />
        <MetricCard
          title="Avg Deal Size"
          value={`$${(avgDealSize / 1000).toFixed(0)}K`}
          icon="TrendingUp"
          color="accent"
          trend="up"
          trendValue="+5%"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon="Target"
          color="primary"
          trend="neutral"
          trendValue="0%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                  <ApperIcon name={getActivityIcon(activity.type)} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium mb-1 capitalize">
                    {activity.type}
                  </p>
                  <p className="text-sm text-secondary truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/contacts")}
              className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <ApperIcon name="UserPlus" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-900">Add Contact</p>
            </button>

            <button
              onClick={() => navigate("/pipeline")}
              className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-accent hover:bg-amber-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-accent flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <ApperIcon name="Plus" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-900">Add Deal</p>
            </button>

            <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <ApperIcon name="Mail" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-900">Send Email</p>
            </button>

            <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group">
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <ApperIcon name="Calendar" size={24} />
              </div>
              <p className="text-sm font-medium text-gray-900">Schedule Call</p>
            </button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/pipeline")}
            className="flex items-center gap-2"
          >
            View Pipeline
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["discovery", "qualified", "proposal", "negotiation"].map((stage, index) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const colors = ["bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-green-500"];
            
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="p-4 rounded-lg bg-gray-50 border border-gray-200"
              >
                <div className={`w-3 h-3 rounded-full ${colors[index]} mb-3`}></div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 capitalize">
                  {stage}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stageDeals.length}
                </p>
                <p className="text-sm text-secondary">
                  ${(stageValue / 1000).toFixed(0)}K
                </p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;