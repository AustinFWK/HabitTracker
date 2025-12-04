import axiosInstance from "../../axios/axiosInstance";

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
  ai_feedback?: string;
}

//Type definiton for check-in data that gets return by API
export interface CreateCheckInResponse {
  ai_feedback?: string;
  date: string;
  mood_id: number;
  entry_id: number;
}

//Function to get all check-ins
export const checkInApi = {
  getAll: async (): Promise<CheckInData[]> => {
    const response = await axiosInstance.get<CheckInData[]>("/check_in");
    return response.data;
  },
};
