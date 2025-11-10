import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import FileGrid from "@/components/organisms/FileGrid";
import { fileService } from "@/services/api/fileService";
import { folderService } from "@/services/api/folderService";

const AllFiles = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const view = searchParams.get("view") || "grid";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const currentFolderId = searchParams.get("folderId") || null;

  useEffect(() => {
    loadData();
  }, [currentFolderId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [filesData, foldersData] = await Promise.all([
        fileService.getByFolder(currentFolderId),
        folderService.getByParent(currentFolderId)
      ]);
      
      setFiles(filesData);
      setFolders(foldersData);
    } catch (err) {
      setError("Failed to load files and folders");
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

const handleFolderSelect = (folder) => {
    const folderItem = { ...folder, type: 'folder' };
    setSelectedItems(prev => {
      const isSelected = prev.some(item => item.Id === folder.Id && item.type === 'folder');
      if (isSelected) {
        return prev.filter(item => !(item.Id === folder.Id && item.type === 'folder'));
      } else {
        return [...prev, folderItem];
      }
    });
  };

  const handleFileDoubleClick = (file) => {
    toast.info(`Opening ${file.name}`);
    console.log("Open file:", file);
  };

  const handleFolderDoubleClick = (folder) => {
    setSearchParams(prev => {
const newParams = new URLSearchParams(prev);
      newParams.set("folderId", folder.Id);
      return newParams;
    });
    setSelectedItems([]);
  };

  const handleToggleStar = async (file) => {
    try {
const updatedFile = await fileService.update(file.Id, { 
        starred_c: !file.starred_c 
      });
      
      setFiles(prev => prev.map(f => 
        f.Id === file.Id ? updatedFile : f
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
    if (path === "/") {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("folderId");
        return newParams;
      });
    } else {
      // Handle folder path navigation
      console.log("Navigate to:", path);
    }
    setSelectedItems([]);
  };

  const handleUpload = async (fileList) => {
    try {
      const uploadPromises = Array.from(fileList).map(file => {
return fileService.create({
          name_c: file.name,
          type: getFileType(file.type),
          size: file.size,
          folderId: currentFolderId,
          thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      });

      await Promise.all(uploadPromises);
      toast.success(`Uploaded ${fileList.length} file(s) successfully`);
      loadData(); // Reload data
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

  const getBreadcrumb = () => {
    // This would normally be built from the current folder path
    // For now, return empty array for root folder
return currentFolderId ? [
      { Id: currentFolderId, name_c: "Sample Folder", path_c: `/folder/${currentFolderId}` }
    ] : [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Files</h1>
          <p className="text-gray-500 mt-1">
            Manage and organize your cloud storage
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
        folders={folders}
        breadcrumb={getBreadcrumb()}
        selectedItems={selectedItems}
        view={view}
        sortBy={sortBy}
        sortOrder={sortOrder}
        loading={loading}
        error={error}
        onFileSelect={handleFileSelect}
        onFileDoubleClick={handleFileDoubleClick}
        onFolderSelect={handleFolderSelect}
        onFolderDoubleClick={handleFolderDoubleClick}
        onToggleStar={handleToggleStar}
        onViewChange={handleViewChange}
        onSortChange={handleSortChange}
        onNavigate={handleNavigate}
        onUpload={handleUpload}
        onRetry={loadData}
      />
    </div>
  );
};

export default AllFiles;