import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import DealCard from "@/components/organisms/DealCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { stageService } from "@/services/api/stageService";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);

  useEffect(() => {
    loadPipelineData();
  }, []);

  const loadPipelineData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, contactsData, stagesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        stageService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setStages(stagesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getContactById = (contactId) => {
    return contacts.find(c => c.Id === contactId);
  };

  const getDealsByStage = (stageName) => {
    return deals.filter(d => d.stage === stageName.toLowerCase());
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === newStage) return;

    try {
      await dealService.updateStage(draggedDeal.Id, newStage);
      const updatedDeals = deals.map(d =>
        d.Id === draggedDeal.Id ? { ...d, stage: newStage } : d
      );
      setDeals(updatedDeals);
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error("Failed to update deal stage");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getStageValue = (stageName) => {
    const stageDeals = getDealsByStage(stageName);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPipelineData} />;

  if (deals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Empty
          title="No deals in pipeline"
          message="Start tracking your sales opportunities by adding your first deal"
          actionLabel="Add Deal"
          onAction={() => toast.info("Add deal functionality coming soon!")}
          icon="TrendingUp"
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline</h1>
            <p className="text-secondary">
              ${(deals.reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(0)}K total value across {deals.length} deals
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-max px-6">
          {stages.map((stage, index) => {
            const stageDeals = getDealsByStage(stage.name);
            const stageValue = getStageValue(stage.name);
            
            return (
              <motion.div
                key={stage.Id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex-shrink-0 w-80"
                onDrop={(e) => handleDrop(e, stage.name.toLowerCase())}
                onDragOver={handleDragOver}
              >
                <Card className="h-full">
                  <div className="p-4 border-b border-gray-200" style={{ borderLeftWidth: "4px", borderLeftColor: stage.color }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                      <span className="text-xs font-medium text-secondary bg-gray-100 px-2 py-1 rounded">
                        {stageDeals.length}
                      </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: stage.color }}>
                      ${(stageValue / 1000).toFixed(0)}K
                    </p>
                  </div>

                  <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-hide">
                    {stageDeals.length === 0 ? (
                      <div className="text-center py-8 text-secondary text-sm">
                        <ApperIcon name="Inbox" className="mx-auto mb-2 text-gray-400" size={32} />
                        No deals in this stage
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <DealCard
                          key={deal.Id}
                          deal={deal}
                          contact={getContactById(deal.contactId)}
                          onDragStart={() => handleDragStart(deal)}
                          onDragEnd={handleDragEnd}
                          isDragging={draggedDeal?.Id === deal.Id}
                        />
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;