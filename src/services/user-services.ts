import axios from "axios";
import { ThemeType, changeThemeAction } from "../redux/slicers/theme-slicer";
import config from "../utils/config";
import store from "../redux/store";
import { LanguageType, changeLangAction } from "../redux/slicers/lang-slicer";

class UserServices {
  changeTheme = async (user_id: string, theme: ThemeType): Promise<void> => {
    await axios.put(config.urls.user + user_id + '/theme', {theme: theme});
    store.dispatch(changeThemeAction(theme));
  };

  changeLang = async (user_id: string, lang: LanguageType): Promise<void> => {
    await axios.put(config.urls.user + user_id + '/lang', {lang});
    store.dispatch(changeLangAction(lang));
  };
};

const userServices = new UserServices();
export default userServices;