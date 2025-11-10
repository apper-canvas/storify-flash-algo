import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StorageUsage = ({ 
  stats,
  className,
  ...props 
}) => {
  if (!stats) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 GB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

const usagePercentage = (stats.usedSpace / stats.totalSpace) * 100;
  const remainingSpace = stats.totalSpace - stats.usedSpace;

  const getUsageColor = () => {
    if (usagePercentage >= 90) return "bg-red-500";
    if (usagePercentage >= 70) return "bg-yellow-500";
    return "bg-gradient-to-r from-primary-500 to-secondary-500";
  };

  const breakdownData = [
{ label: "Images", value: stats.breakdown?.images || 0, icon: "Image", color: "text-green-500" },
    { label: "Documents", value: stats.breakdown?.documents || 0, icon: "FileText", color: "text-blue-500" },
    { label: "Videos", value: stats.breakdown?.videos || 0, icon: "Video", color: "text-purple-500" },
    { label: "Other", value: stats.breakdown?.other || 0, icon: "File", color: "text-gray-500" }
  ].filter(item => item.value > 0);

  return (
    <Card className={cn("space-y-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Storage Usage</h3>
        <div className="text-sm text-gray-500">
          {formatBytes(stats.usedSpace)} of {formatBytes(stats.totalSpace)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", getUsageColor())}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{usagePercentage.toFixed(1)}% used</span>
          <span className="text-gray-600">{formatBytes(remainingSpace)} available</span>
        </div>
      </div>

      {/* Breakdown */}
      {breakdownData.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Breakdown by Type</h4>
          <div className="space-y-2">
            {breakdownData.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ApperIcon name={item.icon} className={cn("w-4 h-4", item.color)} />
                  <span className="text-gray-600">{item.label}</span>
                </div>
                <span className="text-gray-900 font-medium">{formatBytes(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.fileCount}</div>
          <div className="text-sm text-gray-500">Files</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.folderCount}</div>
          <div className="text-sm text-gray-500">Folders</div>
        </div>
      </div>
    </Card>
  );
};

export default StorageUsage;