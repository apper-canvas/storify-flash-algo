import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import FileGrid from "@/components/organisms/FileGrid";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { fileService } from "@/services/api/fileService";

const Trash = () => {
  const [files, setFiles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const view = searchParams.get("view") || "grid";
  const sortBy = searchParams.get("sortBy") || "modifiedAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  useEffect(() => {
    loadDeletedFiles();
  }, []);

  const loadDeletedFiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For this demo, we'll simulate deleted files
      // In a real app, you'd have a separate trash API
      const allFiles = await fileService.getAll();
const deletedFiles = allFiles.filter(file => file.deleted_c);
      setFiles(deletedFiles);
    } catch (err) {
      setError("Failed to load deleted files");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    const fileItem = { ...file, type: 'file' };
    setSelectedItems(prev => {
const isSelected = prev.some(item => item.Id === file.Id && item.type === 'file');
      if (isSelected) {
        return prev.filter(item => !(item.Id === file.Id && item.type === 'file'));
      } else {
        return [...prev, fileItem];
      }
    });
  };

  const handleFileDoubleClick = (file) => {
    toast.info("Use restore action to recover this file");
  };

  const handleRestoreSelected = async () => {
    if (selectedItems.length === 0) return;

    try {
const restorePromises = selectedItems.map(item => 
        fileService.update(item.Id, { deleted_c: false })
      );

      await Promise.all(restorePromises);
      
setFiles(prev => prev.filter(file => 
        !selectedItems.some(item => item.Id === file.Id)
      ));
      
      setSelectedItems([]);
      toast.success(`Restored ${selectedItems.length} file(s)`);
    } catch (error) {
      toast.error("Failed to restore files");
    }
  };

  const handleDeletePermanently = async () => {
    if (selectedItems.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${selectedItems.length} file(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
const deletePromises = selectedItems.map(item => 
        fileService.delete(item.Id)
      );

      await Promise.all(deletePromises);
      
setFiles(prev => prev.filter(file => 
        !selectedItems.some(item => item.Id === file.Id)
      ));
      
      setSelectedItems([]);
      toast.success(`Permanently deleted ${selectedItems.length} file(s)`);
    } catch (error) {
      toast.error("Failed to delete files");
    }
  };

  const handleEmptyTrash = async () => {
    if (files.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete all ${files.length} file(s) in trash? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
const deletePromises = files.map(file => fileService.delete(file.Id));
      await Promise.all(deletePromises);
      
      setFiles([]);
      setSelectedItems([]);
      toast.success("Trash emptied successfully");
    } catch (error) {
      toast.error("Failed to empty trash");
    }
  };

  const handleViewChange = (newView) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("view", newView);
      return newParams;
    });
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sortBy", newSortBy);
      newParams.set("sortOrder", newSortOrder);
      return newParams;
    });
  };

  const handleNavigate = (path) => {
    console.log("Navigate to:", path);
  };

  const handleUpload = () => {
    toast.info("Upload files from the main storage area");
  };

  if (!loading && files.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
          <p className="text-gray-500 mt-1">
            Deleted files are kept here for 30 days
          </p>
        </div>

        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Trash2" className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Trash is Empty</h3>
          <p className="text-gray-500 mb-6">
            Deleted files will appear here and can be restored within 30 days
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
          <p className="text-gray-500 mt-1">
            Deleted files are kept here for 30 days
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {files.length > 0 && (
            <Button
              variant="outline"
              onClick={handleEmptyTrash}
              icon="Trash2"
              size="sm"
            >
              Empty Trash
            </Button>
          )}
        </div>
      </div>

      {/* Action Bar */}
      {selectedItems.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedItems.length} file(s) selected
            </span>
            
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleRestoreSelected}
                icon="RotateCcw"
                size="sm"
              >
                Restore
              </Button>
              
              <Button
                variant="danger"
                onClick={handleDeletePermanently}
                icon="Trash2"
                size="sm"
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Auto-delete warning */}
      {files.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600" />
            <div className="text-sm text-yellow-800">
<strong>Auto-delete:</strong> Files in trash are automatically deleted after 30 days.
              The oldest file will be deleted {formatDistanceToNow(new Date(files[0]?.ModifiedOn), { addSuffix: true })}.
            </div>
          </div>
        </Card>
      )}

      <FileGrid
        files={files}
        folders={[]} // No folders in trash
        breadcrumb={[]}
        selectedItems={selectedItems}
        view={view}
        sortBy={sortBy}
        sortOrder={sortOrder}
        loading={loading}
        error={error}
        onFileSelect={handleFileSelect}
        onFileDoubleClick={handleFileDoubleClick}
        onFolderSelect={() => {}} // No folders
        onFolderDoubleClick={() => {}} // No folders
        onToggleStar={() => {}} // Can't star deleted files
        onViewChange={handleViewChange}
        onSortChange={handleSortChange}
        onNavigate={handleNavigate}
        onUpload={handleUpload}
        onRetry={loadDeletedFiles}
      />
    </div>
  );
};

export default Trash;