import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import StorageUsage from "@/components/molecules/StorageUsage";

const Sidebar = ({ 
  isOpen = true, 
  onClose,
  storageStats,
  folderTree = [],
  className,
  ...props 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const location = useLocation();

  const navigationItems = [
    { id: "files", label: "All Files", icon: "Folder", path: "/", badge: null },
    { id: "recent", label: "Recent Files", icon: "Clock", path: "/recent", badge: null },
    { id: "starred", label: "Starred", icon: "Star", path: "/starred", badge: null },
    { id: "trash", label: "Trash", icon: "Trash2", path: "/trash", badge: null }
  ];

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (folders, depth = 0) => {
    return folders.map((folder) => {
      const isExpanded = expandedFolders.has(folder.id);
      const hasChildren = folder.children && folder.children.length > 0;
      
      return (
        <div key={folder.id}>
          <div 
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors duration-200 group",
              "hover:bg-gray-100 text-gray-700",
              location.pathname === `/folder/${folder.id}` && "bg-primary-50 text-primary-700"
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            {hasChildren && (
              <button
                onClick={() => toggleFolder(folder.id)}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                <ApperIcon 
                  name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                  className="w-3 h-3" 
                />
              </button>
            )}
            
            <ApperIcon 
              name={folder.icon || "Folder"} 
              className="w-4 h-4 text-primary-500" 
            />
            
            <span className="flex-1 truncate">{folder.name}</span>
            
            {folder.itemCount > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded group-hover:bg-gray-200">
                {folder.itemCount}
              </span>
            )}
          </div>
          
          {hasChildren && isExpanded && (
            <div className="mt-1">
              {renderFolderTree(folder.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white", className)} {...props}>
      <div className="flex-1 flex flex-col min-h-0 pt-6">
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
              )}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Folder Tree */}
          {folderTree.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="px-3 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Folders
                </h3>
              </div>
              <div className="space-y-0.5">
                {renderFolderTree(folderTree)}
              </div>
            </div>
          )}
        </nav>

        {/* Storage Usage */}
        {storageStats && (
          <div className="p-4 border-t border-gray-200">
            <StorageUsage stats={storageStats} />
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div className={cn("lg:hidden", !isOpen && "hidden")}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                <ApperIcon name="Cloud" className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Storify
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                )}
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}

            {/* Folder Tree */}
            {folderTree.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="px-3 mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Folders
                  </h3>
                </div>
                <div className="space-y-0.5">
                  {renderFolderTree(folderTree)}
                </div>
              </div>
            )}
          </nav>

          {/* Storage Usage */}
          {storageStats && (
            <div className="p-4 border-t border-gray-200">
              <StorageUsage stats={storageStats} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;