declare module '@efounders/workable-client' {
  interface WorkableClientOptions {
    subdomain: string;
    apiKey: string;
  }

  interface JobsResponse {
    jobs: any[];
    count?: number;
  }

  interface JobsListOptions {
    limit?: number;
    offset?: number;
  }

  interface JobsAPI {
    list(options?: JobsListOptions): Promise<JobsResponse>;
    get(shortcode: string): Promise<any>;
  }

  class WorkableClient {
    constructor(options: WorkableClientOptions);
    jobs: JobsAPI;
  }

  export default WorkableClient;
}
