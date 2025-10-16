import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { variant: "active", label: "Active" },
    inactive: { variant: "inactive", label: "Inactive" },
    lead: { variant: "lead", label: "Lead" }
  };

  const config = statusConfig[status] || statusConfig.active;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default StatusBadge;