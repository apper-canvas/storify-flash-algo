import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SortDropdown = ({ 
  sortBy = "name", 
  sortOrder = "asc",
  onSortChange, 
  className,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { id: "name", label: "Name", icon: "Type" },
    { id: "modifiedAt", label: "Modified", icon: "Calendar" },
    { id: "size", label: "Size", icon: "HardDrive" },
    { id: "type", label: "Type", icon: "Tag" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    onSortChange?.(newSortBy, newSortOrder);
    setIsOpen(false);
  };

  const currentSort = sortOptions.find(option => option.id === sortBy);

  return (
    <div ref={dropdownRef} className={cn("relative", className)} {...props}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
      >
        <ApperIcon name={currentSort?.icon || "ArrowUpDown"} className="w-4 h-4" />
        <span className="hidden sm:inline">{currentSort?.label || "Sort"}</span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSortChange(option.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200",
                sortBy === option.id && "bg-primary-50 text-primary-700"
              )}
            >
              <div className="flex items-center gap-3">
                <ApperIcon name={option.icon} className="w-4 h-4" />
                {option.label}
              </div>
              
              {sortBy === option.id && (
                <ApperIcon 
                  name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                  className="w-4 h-4" 
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;