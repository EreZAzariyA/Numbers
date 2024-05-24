import axios from "axios";
import { ThemeType, changeThemeAction } from "../redux/slicers/theme-slicer";
import config from "../utils/config";
import store from "../redux/store";
import { LanguageType, changeLangAction } from "../redux/slicers/lang-slicer";
import UserModel from "../models/user-model";

class UserServices {

  getUserById = async (user_id: string): Promise<UserModel> => {
    const response = await axios.get<UserModel>(config.urls.users + user_id);
    const user = response.data;
    return user;
  };

  changeTheme = async (user_id: string, theme: ThemeType): Promise<void> => {
    store.dispatch(changeThemeAction(theme));
    await axios.put(config.urls.users + user_id + '/theme', {theme: theme});
  };

  changeLang = async (user_id: string, lang: LanguageType): Promise<void> => {
    await axios.put(config.urls.users + user_id + '/lang', {lang});
    store.dispatch(changeLangAction(lang));
  };
};

const userServices = new UserServices();
export default userServices;