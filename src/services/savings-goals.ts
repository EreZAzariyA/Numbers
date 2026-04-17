import axios from "axios";
import config from "../utils/config";
import { SavingsGoalModel } from "../utils/types";

class SavingsGoalsServices {
  fetchGoals = async (user_id: string, language: string = 'en'): Promise<SavingsGoalModel[]> => {
    const response = await axios.get<SavingsGoalModel[]>(
      config.urls.savingsGoals + user_id,
      { params: { language } }
    );
    return response.data;
  };

  addGoal = async (user_id: string, goal: Partial<SavingsGoalModel>): Promise<SavingsGoalModel> => {
    const response = await axios.post<SavingsGoalModel>(
      config.urls.savingsGoals + user_id,
      goal
    );
    return response.data;
  };

  updateGoal = async (user_id: string, goal: Partial<SavingsGoalModel>): Promise<SavingsGoalModel> => {
    const response = await axios.put<SavingsGoalModel>(
      config.urls.savingsGoals + user_id,
      goal
    );
    return response.data;
  };

  removeGoal = async (user_id: string, goal_id: string): Promise<void> => {
    await axios.delete<void>(config.urls.savingsGoals + user_id, {
      data: { goal_id },
    });
  };
}

const savingsGoalsServices = new SavingsGoalsServices();
export default savingsGoalsServices;
