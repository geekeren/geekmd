import queryString from 'querystring';
import axios from 'axios';

import URL from '../constants/URLs';

const parsed = queryString.parse(window.location.search.replace('?', ''));

axios.post(`${URL.AUTH_HOME_URL}/auth`, {
  code: parsed.code,
}).then((res) => {
  const accessToken = res.data.access_token;
  localStorage.setItem('access_token', accessToken);
  window.opener.location.reload();
  window.close();
});
