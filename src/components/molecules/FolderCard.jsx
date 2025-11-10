import { useState } from "react";
import { cn } from "@/utils/cn";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const FolderCard = ({ 
  folder, 
  isSelected = false, 
  onSelect, 
  onDoubleClick,
  className,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 select-none",
        isSelected && "ring-2 ring-primary-500",
        isHovered && !isSelected && "shadow-md scale-[1.02] -translate-y-1",
        className
      )}
      padding="none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(folder)}
      onDoubleClick={() => onDoubleClick?.(folder)}
      {...props}
    >
      <div className="p-4">
        {/* Folder Icon */}
        <div className="relative mb-3">
          <div className="aspect-square rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
            <ApperIcon 
name={folder.icon_c || folder.icon || "Folder"} 
              className="w-12 h-12 text-white"
            />
          </div>
          
          {/* Item count badge */}
{(folder.item_count_c || folder.itemCount) > 0 && (
            <div className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
              {folder.item_count_c || folder.itemCount}
            </div>
          )}
        </div>

        {/* Folder Info */}
        <div className="space-y-2">
          <div>
            <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
{folder.name_c || folder.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {folder.item_count_c || folder.itemCount || 0} {(folder.item_count_c || folder.itemCount) === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
<span>Folder</span>
            <span>{formatDistanceToNow(new Date(folder.CreatedOn || folder.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </div>
      )}
    </Card>
  );
};

export default FolderCard;