import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASEURL;

const axiosInst = baseURL ? axios.create({
  baseURL: baseURL,
  withCredentials: true,
}) : null;

const wrap = f => {
  if (!baseURL)
    return () => new Promise((_, reject) => {
      reject(new Error("No API URL is defined in configuration"));
    });
  else return f;
};

const loadMedia = wrap(() => {
  return axiosInst.get('/recordings');
});

const authorize = wrap((user, pwd) => {
  const auth = {
    auth: {
      username: user,
      password: pwd,
    }
  };
  return axiosInst.post('/auth', auth);
});

const getUser = wrap(() => {
  return axiosInst.get('/user');
});

const logOut = wrap(() => {
  return axiosInst.delete('/logout');
});

function getStreamURL(id) {
  return baseURL ? `${baseURL}/download/${id}` : null;
}

export { loadMedia, authorize, getUser, logOut, getStreamURL };
