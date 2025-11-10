import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const ViewToggle = ({ 
  view = "grid", 
  onViewChange, 
  className,
  ...props 
}) => {
  const views = [
    { id: "grid", icon: "Grid3X3", label: "Grid view" },
    { id: "list", icon: "List", label: "List view" }
  ];

  return (
    <div 
      className={cn("flex bg-gray-100 p-1 rounded-lg", className)} 
      {...props}
    >
      {views.map((viewOption) => (
        <button
          key={viewOption.id}
          onClick={() => onViewChange?.(viewOption.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            view === viewOption.id 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
          aria-label={viewOption.label}
        >
          <ApperIcon name={viewOption.icon} className="w-4 h-4" />
          <span className="hidden sm:inline">{viewOption.id === "grid" ? "Grid" : "List"}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;