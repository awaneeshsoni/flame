const PlanConfig = {
  free: {
    maxWorkspaces: 1,
    // storagePerWorkspace: 2 * 1024 * 1024, // 2MB
    storagePerWorkspace: 2 * 1024 * 1024 * 1024, // 2GB
    maxMembersPerWorkspace: 1,
  },
  pro: {
    maxWorkspaces: 3,
    storagePerWorkspace: 30 * 1024 * 1024 * 1024, // total 90GB
    maxMembersPerWorkspace: 5,
  },
  business: {
    maxWorkspaces: 5,
    storagePerWorkspace: 100 * 1024 * 1024 * 1024, // total 1000GB
    maxMembersPerWorkspace: 10,
  }
};

export default PlanConfig