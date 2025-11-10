import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const fileService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('file_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "path_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "thumbnail_url_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "starred_c"}},
          {"field": {"Name": "shared_c"}},
          {"field": {"Name": "share_link_c"}},
          {"field": {"Name": "share_expiry_c"}},
          {"field": {"Name": "deleted_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('file_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "path_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "thumbnail_url_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "starred_c"}},
          {"field": {"Name": "shared_c"}},
          {"field": {"Name": "share_link_c"}},
          {"field": {"Name": "share_expiry_c"}},
          {"field": {"Name": "deleted_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("File not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching file ${id}:`, error);
      toast.error("Failed to load file");
      throw error;
    }
  },

  async getByFolder(folderId) {
    try {
      const apperClient = getApperClient();
      const whereConditions = folderId ? 
        [{"FieldName": "folder_id_c", "Operator": "EqualTo", "Values": [parseInt(folderId)]}] :
        [{"FieldName": "folder_id_c", "Operator": "DoesNotHaveValue", "Values": []}];

      const response = await apperClient.fetchRecords('file_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "path_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "thumbnail_url_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "starred_c"}},
          {"field": {"Name": "shared_c"}},
          {"field": {"Name": "share_link_c"}},
          {"field": {"Name": "share_expiry_c"}},
          {"field": {"Name": "deleted_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: whereConditions
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching files by folder:", error);
      toast.error("Failed to load files");
      return [];
    }
  },

  async create(fileData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('file_c', {
        records: [{
          name_c: fileData.name_c || fileData.name,
          type_c: fileData.type_c || fileData.type,
          size_c: fileData.size_c || fileData.size,
          path_c: fileData.path_c || fileData.path || "/",
          folder_id_c: fileData.folder_id_c || fileData.folderId || null,
          thumbnail_url_c: fileData.thumbnail_url_c || fileData.thumbnailUrl || null,
          url_c: fileData.url_c || fileData.url || `https://storage.example.com/files/${fileData.name}`,
          starred_c: fileData.starred_c || fileData.starred || false,
          shared_c: fileData.shared_c || fileData.shared || false,
          share_link_c: fileData.share_link_c || fileData.shareLink || null,
          share_expiry_c: fileData.share_expiry_c || fileData.shareExpiry || null,
          deleted_c: fileData.deleted_c || fileData.deleted || false
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} files:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("File uploaded successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating file:", error);
      toast.error("Failed to upload file");
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      // Map updates to database field names
      if (updates.name_c !== undefined || updates.name !== undefined) {
        updateData.name_c = updates.name_c || updates.name;
      }
      if (updates.type_c !== undefined || updates.type !== undefined) {
        updateData.type_c = updates.type_c || updates.type;
      }
      if (updates.size_c !== undefined || updates.size !== undefined) {
        updateData.size_c = updates.size_c || updates.size;
      }
      if (updates.path_c !== undefined || updates.path !== undefined) {
        updateData.path_c = updates.path_c || updates.path;
      }
      if (updates.folder_id_c !== undefined || updates.folderId !== undefined) {
        updateData.folder_id_c = updates.folder_id_c || updates.folderId;
      }
      if (updates.thumbnail_url_c !== undefined || updates.thumbnailUrl !== undefined) {
        updateData.thumbnail_url_c = updates.thumbnail_url_c || updates.thumbnailUrl;
      }
      if (updates.url_c !== undefined || updates.url !== undefined) {
        updateData.url_c = updates.url_c || updates.url;
      }
      if (updates.starred_c !== undefined || updates.starred !== undefined) {
        updateData.starred_c = updates.starred_c || updates.starred;
      }
      if (updates.shared_c !== undefined || updates.shared !== undefined) {
        updateData.shared_c = updates.shared_c || updates.shared;
      }
      if (updates.share_link_c !== undefined || updates.shareLink !== undefined) {
        updateData.share_link_c = updates.share_link_c || updates.shareLink;
      }
      if (updates.share_expiry_c !== undefined || updates.shareExpiry !== undefined) {
        updateData.share_expiry_c = updates.share_expiry_c || updates.shareExpiry;
      }
      if (updates.deleted_c !== undefined || updates.deleted !== undefined) {
        updateData.deleted_c = updates.deleted_c || updates.deleted;
      }

      const response = await apperClient.updateRecord('file_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("File not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} files:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("File updated successfully");
          return successful[0].data;
        }
      }

      throw new Error("Update failed");
    } catch (error) {
      console.error(`Error updating file ${id}:`, error);
      toast.error("Failed to update file");
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('file_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} files:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("File deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting file ${id}:`, error);
      toast.error("Failed to delete file");
      return false;
    }
  }
};