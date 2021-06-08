import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASEURL;

const axiosInst = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

function loadMedia() {
  return axiosInst.get('/recordings');
};

function authorize(user, pwd) {
  const auth = {
    auth: {
      username: user,
      password: pwd
    }
  };
  return axiosInst.post('/auth', auth);
};

function getUser() {
  return axiosInst.get('/user');
}

function logOut() {
  return axiosInst.delete('/logout');
}

function getStreamURL(id) {
  return `${baseURL}/download/${id}`;
}

export { loadMedia, authorize, getUser, logOut, getStreamURL };
