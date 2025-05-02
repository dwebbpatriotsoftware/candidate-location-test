// Define TypeScript interfaces for the API responses
interface WorkableQuestion {
  id: string;
  body: string;
  type: string;
  required: boolean;
  single_answer?: boolean;
  choices?: Array<{
    id: string;
    body: string;
  }>;
  supported_file_types?: string[];
  max_file_size?: number;
}

interface FormField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  max_length?: number;
  fields?: FormField[];
  supported_file_types?: string[];
  max_file_size?: number;
}

interface ApplicationFormResponse {
  form_fields: FormField[];
  questions: WorkableQuestion[];
}

interface QuestionsResponse {
  questions: WorkableQuestion[];
}

interface CustomAttribute {
  id: string;
  label: string;
  type: string;
  required: boolean;
  provider?: string;
  single_answer?: boolean;
  choices?: Array<{
    id: string;
    body: string;
  }>;
}

interface CustomAttributesResponse {
  custom_attributes: CustomAttribute[];
}

interface NormalizedQuestion extends WorkableQuestion {
  question_key: string;
  provider?: string;
  custom_attribute?: CustomAttribute;
}

interface QuestionsMap {
  [key: string]: NormalizedQuestion;
}

interface CombinedJobData {
  application_form: ApplicationFormResponse;
  questions: QuestionsResponse;
  custom_attributes: CustomAttributesResponse;
  questions_map: QuestionsMap;
}

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
  },

  async getJobApplicationForm(shortcode: string): Promise<ApplicationFormResponse> {
    try {
      // Use the server API endpoint (we'll need to create this)
      const response = await fetch(`/api/workable/jobs/${shortcode}/application_form`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job application form: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching job application form:', error);
      throw error;
    }
  },
  
  async getJobQuestions(shortcode: string): Promise<QuestionsResponse> {
    try {
      // Use the server API endpoint (we'll need to create this)
      const response = await fetch(`/api/workable/jobs/${shortcode}/questions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job questions: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching job questions:', error);
      throw error;
    }
  },
  
  async getJobCustomAttributes(shortcode: string): Promise<CustomAttributesResponse> {
    try {
      // Use the server API endpoint (we'll need to create this)
      const response = await fetch(`/api/workable/jobs/${shortcode}/custom_attributes`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job custom attributes: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching job custom attributes:', error);
      throw error;
    }
  },
  
  async getJobWithAllData(shortcode: string): Promise<CombinedJobData> {
    try {
      // Fetch all three APIs in parallel
      const [applicationForm, questions, customAttributes] = await Promise.all([
        this.getJobApplicationForm(shortcode),
        this.getJobQuestions(shortcode),
        this.getJobCustomAttributes(shortcode)
      ]);
      
      // Create a normalized questions map for easy access
      const questionsMap: QuestionsMap = {};
      
      // Process application form questions
      if (applicationForm && applicationForm.questions) {
        applicationForm.questions.forEach((question: WorkableQuestion) => {
          const questionKey = question.id.replace('CA_', ''); // Remove CA_ prefix if present
          questionsMap[question.id] = {
            ...question,
            question_key: questionKey
          };
        });
      }
      
      // Process questions API questions (should be the same as application form questions)
      if (questions && questions.questions) {
        questions.questions.forEach((question: WorkableQuestion) => {
          const questionKey = question.id.replace('CA_', ''); // Remove CA_ prefix if present
          if (!questionsMap[question.id]) {
            questionsMap[question.id] = {
              ...question,
              question_key: questionKey
            };
          }
        });
      }
      
      // Process custom attributes
      if (customAttributes && customAttributes.custom_attributes) {
        customAttributes.custom_attributes.forEach((attr: CustomAttribute) => {
          const fullId = `CA_${attr.id}`; // Add CA_ prefix to match other APIs
          
          // If this ID already exists in our map, merge the data
          if (questionsMap[fullId]) {
            questionsMap[fullId] = {
              ...questionsMap[fullId],
              provider: attr.provider,
              // Keep any additional metadata from custom attributes
              custom_attribute: attr
            };
          } else {
            // If it's a new ID, add it to the map
            questionsMap[fullId] = {
              id: fullId,
              question_key: attr.id,
              body: attr.label,
              type: attr.type,
              required: attr.required || false,
              provider: attr.provider,
              // For multiple choice or dropdown questions
              choices: attr.choices,
              single_answer: attr.single_answer,
              // Keep the original custom attribute
              custom_attribute: attr
            };
          }
        });
      }
      
      // Return the combined data
      return {
        application_form: applicationForm,
        questions: questions,
        custom_attributes: customAttributes,
        questions_map: questionsMap
      };
    } catch (error) {
      console.error('Error fetching job with all data:', error);
      throw error;
    }
  }
}
