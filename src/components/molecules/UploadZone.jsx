import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const UploadZone = ({ 
  onUpload, 
  className, 
  children,
  disabled = false,
  ...props 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setIsUploading(true);
      try {
        await onUpload?.(files);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsUploading(true);
      try {
        await onUpload?.(files);
      } finally {
        setIsUploading(false);
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-300",
          isDragOver && !disabled ? "border-accent-500 bg-accent-50 scale-[1.02]" : "border-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...props}
      >
        {children || (
          <div className="p-8 text-center space-y-4">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300",
              isDragOver ? "bg-accent-100" : "bg-gray-100"
            )}>
              <ApperIcon 
                name={isUploading ? "Loader2" : "Upload"} 
                className={cn(
                  "w-8 h-8",
                  isDragOver ? "text-accent-600" : "text-gray-400",
                  isUploading && "animate-spin"
                )} 
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {isUploading ? "Uploading files..." : "Upload your files"}
              </h3>
              <p className="text-gray-500">
                {isUploading 
                  ? "Please wait while we process your files"
                  : "Drag and drop files here, or click to browse"
                }
              </p>
            </div>
            
            {!isUploading && (
              <Button 
                onClick={openFileDialog}
                disabled={disabled}
                icon="Upload"
                className="mt-4"
              >
                Choose Files
              </Button>
            )}
          </div>
        )}
        
        {/* Overlay for drag state */}
        {isDragOver && !disabled && (
          <div className="absolute inset-0 bg-accent-500/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center space-y-2">
              <ApperIcon name="Upload" className="w-12 h-12 text-accent-600 mx-auto" />
              <p className="text-accent-700 font-medium">Drop files to upload</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </>
  );
};

export default UploadZone;