const PlanConfig = {
  free: {
    maxWorkspaces: 1,
    // storagePerWorkspace: 2 * 1024 * 1024, // 2GB
    storagePerWorkspace: 2 * 1024 * 1024 * 1024, // 2GB
    maxMembersPerWorkspace: 2,
  },
  pro: {
    maxWorkspaces: 3,
    storagePerWorkspace: 30 * 1024 * 1024 * 1024, // 30GB
    maxMembersPerWorkspace: 5,
  },
  business: {
    maxWorkspaces: 10,
    storagePerWorkspace: 100 * 1024 * 1024 * 1024, // 100GB
    maxMembersPerWorkspace: 10,
  }
};

export default PlanConfig