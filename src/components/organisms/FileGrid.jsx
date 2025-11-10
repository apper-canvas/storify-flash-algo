import { useState, useMemo } from "react";
import { cn } from "@/utils/cn";
import FileCard from "@/components/molecules/FileCard";
import FolderCard from "@/components/molecules/FolderCard";
import ViewToggle from "@/components/molecules/ViewToggle";
import SortDropdown from "@/components/molecules/SortDropdown";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import UploadZone from "@/components/molecules/UploadZone";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const FileGrid = ({
  files = [],
  folders = [],
  breadcrumb = [],
  selectedItems = [],
  view = "grid",
  sortBy = "name",
  sortOrder = "asc",
  loading = false,
  error = null,
  onFileSelect,
  onFileDoubleClick,
  onFolderSelect,
  onFolderDoubleClick,
  onToggleStar,
  onViewChange,
  onSortChange,
  onNavigate,
  onUpload,
  onRetry,
  className,
  ...props
}) => {
  const [dragOver, setDragOver] = useState(false);

  // Sort files and folders
  const sortedItems = useMemo(() => {
    const allItems = [
      ...folders.map(folder => ({ ...folder, type: 'folder' })),
      ...files.map(file => ({ ...file, type: 'file' }))
    ];

    return allItems.sort((a, b) => {
      // Always show folders first
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;

      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'modifiedAt':
          aValue = new Date(a.modifiedAt || a.createdAt);
          bValue = new Date(b.modifiedAt || b.createdAt);
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [files, folders, sortBy, sortOrder]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload?.(files);
    }
  };

  if (loading) {
    return (
      <div className="h-64">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <ErrorView error={error} onRetry={onRetry} />;
  }

  const isEmpty = sortedItems.length === 0;

  return (
    <div 
      className={cn("space-y-6", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      {/* Header */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <Breadcrumb path={breadcrumb} onNavigate={onNavigate} />
        )}

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={onViewChange} />
            <SortDropdown 
              sortBy={sortBy} 
              sortOrder={sortOrder} 
              onSortChange={onSortChange} 
            />
          </div>
          
          <div className="text-sm text-gray-500">
            {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      </div>

      {/* Content */}
      {isEmpty ? (
        <UploadZone onUpload={onUpload}>
          <Empty
            title="No files in this folder"
            description="Upload your first file or create a folder to get started"
            icon="FolderOpen"
            actionLabel="Upload Files"
            onAction={() => {
              // Will be handled by UploadZone
            }}
          />
        </UploadZone>
      ) : (
        <div className={cn(
          "transition-all duration-200",
          view === "grid" 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
            : "space-y-2"
        )}>
          {sortedItems.map((item) => {
            const isSelected = selectedItems.some(selected => 
              selected.id === item.id && selected.type === item.type
            );

            if (item.type === 'folder') {
              return (
                <FolderCard
                  key={`folder-${item.id}`}
                  folder={item}
                  isSelected={isSelected}
                  onSelect={onFolderSelect}
                  onDoubleClick={onFolderDoubleClick}
                  className={view === "list" ? "!aspect-auto" : ""}
                />
              );
            } else {
              return (
                <FileCard
                  key={`file-${item.id}`}
                  file={item}
                  isSelected={isSelected}
                  onSelect={onFileSelect}
                  onDoubleClick={onFileDoubleClick}
                  onToggleStar={onToggleStar}
                  className={view === "list" ? "!aspect-auto" : ""}
                />
              );
            }
          })}
        </div>
      )}

      {/* Upload overlay */}
      {dragOver && !isEmpty && (
        <div className="fixed inset-0 bg-accent-500/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-dashed border-accent-500">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📁</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Drop files to upload</h3>
                <p className="text-gray-500">Release to add files to this folder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileGrid;