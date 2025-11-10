import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import { fileService } from "@/services/api/fileService";
import { storageService } from "@/services/api/storageService";
import { folderService } from "@/services/api/folderService";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storageStats, setStorageStats] = useState(null);
  const [folderTree, setFolderTree] = useState([]);

  useEffect(() => {
    loadStorageStats();
    loadFolderTree();
  }, []);

  const loadStorageStats = async () => {
    try {
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error("Failed to load storage stats:", error);
    }
  };

  const loadFolderTree = async () => {
    try {
      const folders = await folderService.getAll();
      // Build tree structure
      const tree = buildFolderTree(folders);
      setFolderTree(tree);
    } catch (error) {
      console.error("Failed to load folder tree:", error);
    }
  };

  const buildFolderTree = (folders) => {
    const folderMap = new Map();
    const rootFolders = [];

    // Create folder map
    folders.forEach(folder => {
folderMap.set(folder.Id, { ...folder, children: [] });
    });

    // Build tree
    folders.forEach(folder => {
      const folderNode = folderMap.get(folder.Id);
      if (folder.parent_id_c && folderMap.has(folder.parent_id_c)) {
        folderMap.get(folder.parent_id_c).children.push(folderNode);
      } else {
        rootFolders.push(folderNode);
      }
    });

    return rootFolders;
  };

  const handleSearch = (query) => {
    console.log("Search:", query);
    // Implement search functionality
  };

  const handleUpload = () => {
    console.log("Upload clicked");
    // Implement upload functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        storageStats={storageStats}
        folderTree={folderTree}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header 
          onSearch={handleSearch}
          onUpload={handleUpload}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;