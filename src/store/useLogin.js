import { useStore } from "./Context";
import { loginUser } from "../services/loginService";

const useLogin = () => {
  const [state, setState] = useStore();

  const login = async (loginInfo) => {
      try {
        await loginUser(loginInfo);
        setState({ ...state, loggedIn: true, error: false});
        return true;
      } catch (e) {
        const { data } = e.response;
        setState({ ...state, loggedIn: false, error: data});
        return false;
      }
  }
  
  return {
    error: state.error,
    loggedIn: state.loggedIn,
    login,
  }
};

export default useLogin;
