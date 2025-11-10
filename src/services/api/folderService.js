import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const folderService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('folder_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "path_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "item_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error("Failed to load folders");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('folder_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "path_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "item_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Folder not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching folder ${id}:`, error);
      toast.error("Failed to load folder");
      throw error;
    }
  },

  async getByParent(parentId) {
    try {
      const apperClient = getApperClient();
      const whereConditions = parentId ? 
        [{"FieldName": "parent_id_c", "Operator": "EqualTo", "Values": [parseInt(parentId)]}] :
        [{"FieldName": "parent_id_c", "Operator": "DoesNotHaveValue", "Values": []}];

      const response = await apperClient.fetchRecords('folder_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "path_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "item_count_c"}},
          {"field": {"Name": "CreatedOn"}}
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
      console.error("Error fetching folders by parent:", error);
      toast.error("Failed to load folders");
      return [];
    }
  },

  async create(folderData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('folder_c', {
        records: [{
          name_c: folderData.name_c || folderData.name,
          parent_id_c: folderData.parent_id_c || folderData.parentId || null,
          path_c: folderData.path_c || folderData.path || "/",
          color_c: folderData.color_c || folderData.color || "#4F46E5",
          icon_c: folderData.icon_c || folderData.icon || "Folder",
          item_count_c: folderData.item_count_c || folderData.itemCount || 0
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
          console.error(`Failed to create ${failed.length} folders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Folder created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
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
      if (updates.parent_id_c !== undefined || updates.parentId !== undefined) {
        updateData.parent_id_c = updates.parent_id_c || updates.parentId;
      }
      if (updates.path_c !== undefined || updates.path !== undefined) {
        updateData.path_c = updates.path_c || updates.path;
      }
      if (updates.color_c !== undefined || updates.color !== undefined) {
        updateData.color_c = updates.color_c || updates.color;
      }
      if (updates.icon_c !== undefined || updates.icon !== undefined) {
        updateData.icon_c = updates.icon_c || updates.icon;
      }
      if (updates.item_count_c !== undefined || updates.itemCount !== undefined) {
        updateData.item_count_c = updates.item_count_c || updates.itemCount;
      }

      const response = await apperClient.updateRecord('folder_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Folder not found");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} folders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Folder updated successfully");
          return successful[0].data;
        }
      }

      throw new Error("Update failed");
    } catch (error) {
      console.error(`Error updating folder ${id}:`, error);
      toast.error("Failed to update folder");
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('folder_c', {
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
          console.error(`Failed to delete ${failed.length} folders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Folder deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting folder ${id}:`, error);
      toast.error("Failed to delete folder");
      return false;
    }
  }
};