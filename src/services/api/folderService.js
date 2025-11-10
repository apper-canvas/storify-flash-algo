import mockData from "@/services/mockData/folders.json";

let folders = [...mockData];

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const folderService = {
  async getAll() {
    await delay();
    return [...folders];
  },

  async getById(id) {
    await delay();
    const folder = folders.find(f => f.Id === parseInt(id));
    if (!folder) {
      throw new Error("Folder not found");
    }
    return { ...folder };
  },

  async getByParent(parentId) {
    await delay();
    const parentIdInt = parentId ? parseInt(parentId) : null;
    return folders.filter(folder => folder.parentId === parentIdInt);
  },

  async create(folderData) {
    await delay();
    
    const newFolder = {
      Id: Math.max(...folders.map(f => f.Id), 0) + 1,
      name: folderData.name,
      parentId: folderData.parentId || null,
      path: folderData.path || "/",
      color: folderData.color || "#4F46E5",
      icon: folderData.icon || "Folder",
      createdAt: new Date().toISOString(),
      itemCount: 0
    };

    folders.push(newFolder);
    return { ...newFolder };
  },

  async update(id, updates) {
    await delay();
    
    const index = folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Folder not found");
    }

    folders[index] = {
      ...folders[index],
      ...updates,
      Id: folders[index].Id // Preserve ID
    };

    return { ...folders[index] };
  },

  async delete(id) {
    await delay();
    
    const index = folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Folder not found");
    }

    folders.splice(index, 1);
    return true;
  }
};