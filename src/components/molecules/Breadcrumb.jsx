import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Breadcrumb = ({ 
  path = [], 
  onNavigate, 
  className,
  ...props 
}) => {
  return (
    <nav 
      className={cn("flex items-center space-x-1 text-sm", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <button
        onClick={() => onNavigate?.("/")}
        className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
      >
        <ApperIcon name="Home" className="w-4 h-4" />
        <span>All Files</span>
      </button>

      {path.length > 0 && path.map((item, index) => (
        <div key={item.id || index} className="flex items-center space-x-1">
          <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
          
          <button
            onClick={() => onNavigate?.(item.path)}
            className={cn(
              "px-2 py-1 rounded-md transition-colors duration-200",
              index === path.length - 1
                ? "text-gray-900 font-medium cursor-default"
                : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
            )}
            disabled={index === path.length - 1}
          >
            {item.name}
          </button>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;