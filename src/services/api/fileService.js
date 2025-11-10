import mockData from "@/services/mockData/files.json";

let files = [...mockData];

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const fileService = {
  async getAll() {
    await delay();
    return [...files];
  },

  async getById(id) {
    await delay();
    const file = files.find(f => f.Id === parseInt(id));
    if (!file) {
      throw new Error("File not found");
    }
    return { ...file };
  },

  async getByFolder(folderId) {
    await delay();
    const folderIdInt = folderId ? parseInt(folderId) : null;
    return files.filter(file => file.folderId === folderIdInt);
  },

  async create(fileData) {
    await delay();
    
    const newFile = {
      Id: Math.max(...files.map(f => f.Id), 0) + 1,
      name: fileData.name,
      type: fileData.type,
      size: fileData.size,
      path: fileData.path || "/",
      folderId: fileData.folderId || null,
      thumbnailUrl: fileData.thumbnailUrl || null,
      url: fileData.url || `https://storage.example.com/files/${fileData.name}`,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      starred: fileData.starred || false,
      shared: fileData.shared || false,
      shareLink: fileData.shareLink || null,
      shareExpiry: fileData.shareExpiry || null,
      deleted: false
    };

    files.push(newFile);
    return { ...newFile };
  },

  async update(id, updates) {
    await delay();
    
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }

    files[index] = {
      ...files[index],
      ...updates,
      Id: files[index].Id, // Preserve ID
      modifiedAt: new Date().toISOString()
    };

    return { ...files[index] };
  },

  async delete(id) {
    await delay();
    
    const index = files.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("File not found");
    }

    files.splice(index, 1);
    return true;
  }
};