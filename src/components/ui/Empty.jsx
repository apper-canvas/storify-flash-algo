import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No files yet",
  description = "Upload your first file to get started",
  icon = "FileText",
  actionLabel = "Upload Files",
  onAction,
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex items-center justify-center p-12", className)} {...props}>
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-10 h-10 text-primary-500" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-500 leading-relaxed">{description}</p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <ApperIcon name="Upload" className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;