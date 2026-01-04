import { axiosInstance } from "../../axios/axiosInstance";

//Type definition for check-in data
export interface CheckInFormData {
  entry: string;
  mood_scale: number;
}

//Type definition for check-in data that is returned by successful submission
export interface CheckInData {
  entry: string;
  mood_scale: number;
  date: string;
  mood_id: number;
  entry_id: number;
  ai_feedback: string;
}

//Type definiton for check-in data that gets return by API
export interface CreateCheckInResponse {
  ai_feedback: string;
  date: string;
  mood_id: number;
  entry_id: number;
}

export const checkInApi = {
  //Function to get all check-ins
  getAll: async (): Promise<CheckInData[]> => {
    const response = await axiosInstance.get<CheckInData[]>("/check_in");
    return response.data;
  },

  //Function to get specific check-in by date
  getByDate: async (date: string): Promise<CheckInData> => {
    const response = await axiosInstance.get<CheckInData>(`/check_in/${date}`);
    return response.data;
  },

  //Function to create a new check-in
  create: async (data: CheckInFormData): Promise<CreateCheckInResponse> => {
    const response = await axiosInstance.post("/check_in/create", data);
    return response.data;
  },

  //Function to update an existing check-in
  update: async (date: string, data: CheckInFormData): Promise<CheckInData> => {
    const response = await axiosInstance.put<CheckInData>(
      `/check_in/${date}`,
      data
    );
    return response.data;
  },
};
