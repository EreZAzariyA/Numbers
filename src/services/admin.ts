import axios from "axios";
import config from "../utils/config";

export interface AdminUserSummary {
  _id: string;
  profile: {
    first_name: string;
    last_name: string;
    image_url?: string;
  };
  emails: { email: string; isValidate?: boolean; isActive?: boolean }[];
  role: string;
  createdAt: string;
}

export interface ReindexResult {
  queued?: number;
  usersQueued?: number;
  banksQueued?: number;
}

class AdminService {
  listUsers = async (): Promise<AdminUserSummary[]> => {
    const response = await axios.get<AdminUserSummary[]>(config.urls.admin.users);
    return response.data;
  };

  reindexAll = async (): Promise<ReindexResult> => {
    const response = await axios.post<ReindexResult>(config.urls.admin.reindexAll);
    return response.data;
  };

  reindexUser = async (user_id: string): Promise<ReindexResult> => {
    const response = await axios.post<ReindexResult>(`${config.urls.admin.reindexUser}/${user_id}`);
    return response.data;
  };
}

const adminService = new AdminService();
export default adminService;
