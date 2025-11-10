import { fileService } from "@/services/api/fileService";
import { folderService } from "@/services/api/folderService";

export const storageService = {
  async getStorageStats() {
    try {
      // Calculate real stats from files and folders
      const files = await fileService.getAll();
      const folders = await folderService.getAll();
      
      const totalUsed = files.reduce((sum, file) => sum + (file.size_c || 0), 0);
      
      const breakdown = files.reduce((acc, file) => {
        switch (file.type_c) {
          case 'image':
            acc.images += file.size_c || 0;
            break;
          case 'video':
            acc.videos += file.size_c || 0;
            break;
          case 'document':
          case 'pdf':
          case 'spreadsheet':
          case 'presentation':
            acc.documents += file.size_c || 0;
            break;
          default:
            acc.other += file.size_c || 0;
        }
        return acc;
      }, {
        images: 0,
        documents: 0,
        videos: 0,
        other: 0
      });

      return {
        totalSpace: 10737418240, // 10GB default
        usedSpace: totalUsed,
        fileCount: files.length,
        folderCount: folders.length,
        breakdown
      };
    } catch (error) {
      console.error("Error calculating storage stats:", error);
      throw error;
    }
  }
};