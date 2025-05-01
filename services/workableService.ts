export const workableService = {
  async getJobs(page = 1, limit = 10) {
    try {
      // Use the server API endpoint
      const response = await fetch(`/api/workable/jobs?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Workable jobs: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Workable jobs:', error);
      throw error;
    }
  },
  
  async getTotalJobsCount() {
    try {
      // Use the server API endpoint
      const response = await fetch('/api/workable/jobs/count');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Workable jobs count: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Return the total count
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching Workable jobs count:', error);
      throw error;
    }
  }
}
