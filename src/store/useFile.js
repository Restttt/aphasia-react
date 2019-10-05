import { useStore } from "./Context";
import { submitFile } from "../services/fileService";

const useLogin = () => {
  const [state, setState] = useStore();

  const uploadFile = async (file) => {
      setState({ ...state, file, loading: true });
  }

  const translateFile = async () => {
      try {
          const formData = new FormData();
          formData.append('file', state.file);
          const response = await submitFile(formData);
          setState({ ...state, response: response.data, loading: false})
      } catch (e) {
          console.log(e);
          setState({ ...state, response: e.response.data.details, loading: false })
      }
  }

  const clearFile = async () => {
      setState({ ...state, response: false, loading: false })
  }
  
  return {
    file: state.file,
    loading: state.loading,
    response: state.response,
    uploadFile,
    translateFile,
    clearFile,
  }
};

export default useLogin;