import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import FileGrid from "@/components/organisms/FileGrid";
import { fileService } from "@/services/api/fileService";

const RecentFiles = () => {
  const [files, setFiles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const view = searchParams.get("view") || "grid";
  const sortBy = searchParams.get("sortBy") || "modifiedAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allFiles = await fileService.getAll();
      
      // Filter files modified in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentFiles = allFiles
        .filter(file => new Date(file.modifiedAt) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
      
      setFiles(recentFiles);
    } catch (err) {
      setError("Failed to load recent files");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    const fileItem = { ...file, type: 'file' };
    setSelectedItems(prev => {
      const isSelected = prev.some(item => item.id === file.id && item.type === 'file');
      if (isSelected) {
        return prev.filter(item => !(item.id === file.id && item.type === 'file'));
      } else {
        return [...prev, fileItem];
      }
    });
  };

  const handleFileDoubleClick = (file) => {
    toast.info(`Opening ${file.name}`);
    console.log("Open file:", file);
  };

  const handleToggleStar = async (file) => {
    try {
      const updatedFile = await fileService.update(file.id, { 
        starred: !file.starred 
      });
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? updatedFile : f
      ));
      
      toast.success(updatedFile.starred ? "Added to starred" : "Removed from starred");
    } catch (error) {
      toast.error("Failed to update file");
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

  const handleUpload = async (fileList) => {
    try {
      const uploadPromises = Array.from(fileList).map(file => {
        return fileService.create({
          name: file.name,
          type: getFileType(file.type),
          size: file.size,
          folderId: null,
          thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      });

      await Promise.all(uploadPromises);
      toast.success(`Uploaded ${fileList.length} file(s) successfully`);
      loadRecentFiles(); // Reload data
    } catch (error) {
      toast.error("Failed to upload files");
      console.error("Upload error:", error);
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
    if (mimeType.includes('javascript') || mimeType.includes('html') || mimeType.includes('css')) return 'code';
    return 'other';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>
          <p className="text-gray-500 mt-1">
            Files you've accessed in the last 30 days
          </p>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedItems.length} selected
            </span>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Delete
            </button>
          </div>
        )}
      </div>

      <FileGrid
        files={files}
        folders={[]} // No folders in recent view
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
        onToggleStar={handleToggleStar}
        onViewChange={handleViewChange}
        onSortChange={handleSortChange}
        onNavigate={handleNavigate}
        onUpload={handleUpload}
        onRetry={loadRecentFiles}
      />
    </div>
  );
};

export default RecentFiles;