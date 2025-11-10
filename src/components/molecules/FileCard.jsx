import { useState } from "react";
import { cn } from "@/utils/cn";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const FileCard = ({ 
  file, 
  isSelected = false, 
  onSelect, 
  onDoubleClick,
  onToggleStar,
  className,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = (type) => {
    const iconMap = {
      image: "Image",
      video: "Video",
      audio: "Music",
      pdf: "FileText",
      document: "FileText",
      spreadsheet: "FileSpreadsheet", 
      presentation: "Presentation",
      archive: "Archive",
      code: "Code"
    };
    return iconMap[type] || "File";
  };

  const getFileTypeColor = (type) => {
    const colorMap = {
      image: "text-green-500",
      video: "text-blue-500",
      audio: "text-purple-500",
      pdf: "text-red-500",
      document: "text-blue-600",
      spreadsheet: "text-green-600",
      presentation: "text-orange-500",
      archive: "text-yellow-600",
      code: "text-gray-600"
    };
    return colorMap[type] || "text-gray-500";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 select-none",
        isSelected && "ring-2 ring-primary-500 bg-primary-50",
        isHovered && !isSelected && "shadow-md scale-[1.02] -translate-y-1",
        className
      )}
      padding="none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(file)}
      onDoubleClick={() => onDoubleClick?.(file)}
      {...props}
    >
      <div className="p-4">
        {/* Thumbnail/Icon */}
        <div className="relative mb-3">
{file.thumbnail_url_c || file.thumbnailUrl ? (
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={file.thumbnail_url_c || file.thumbnailUrl} 
                alt={file.name_c || file.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <ApperIcon 
name={getFileIcon(file.type_c || file.type)} 
                className={cn("w-12 h-12", getFileTypeColor(file.type_c || file.type))}
              />
            </div>
          )}
          
          {/* Star button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
onToggleStar?.(file);
            }}
            className={cn(
              "absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100",
              (file.starred_c || file.starred) ? "bg-yellow-100 text-yellow-600 opacity-100" : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-yellow-500"
            )}
          >
            <ApperIcon 
              name={(file.starred_c || file.starred) ? "Star" : "Star"} 
              className="w-4 h-4" 
              fill={(file.starred_c || file.starred) ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* File Info */}
        <div className="space-y-2">
          <div>
<h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
              {file.name_c || file.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.size_c || file.size)}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
<span className="capitalize">{file.type_c || file.type}</span>
            <span>{formatDistanceToNow(new Date(file.ModifiedOn || file.modifiedAt), { addSuffix: true })}</span>
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

export default FileCard;