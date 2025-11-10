import mockData from "@/services/mockData/storageStats.json";
import { fileService } from "@/services/api/fileService";
import { folderService } from "@/services/api/folderService";

// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  async getStorageStats() {
    await delay();
    
    // Calculate real stats from files
    const files = await fileService.getAll();
    const folders = await folderService.getAll();
    
    const totalUsed = files.reduce((sum, file) => sum + (file.size || 0), 0);
    
    const breakdown = files.reduce((acc, file) => {
      switch (file.type) {
        case 'image':
          acc.images += file.size || 0;
          break;
        case 'video':
          acc.videos += file.size || 0;
          break;
        case 'document':
        case 'pdf':
        case 'spreadsheet':
        case 'presentation':
          acc.documents += file.size || 0;
          break;
        default:
          acc.other += file.size || 0;
      }
      return acc;
    }, {
      images: 0,
      documents: 0,
      videos: 0,
      other: 0
    });

    return {
      totalSpace: mockData.totalSpace,
      usedSpace: totalUsed,
      fileCount: files.length,
      folderCount: folders.length,
      breakdown
    };
  }
};