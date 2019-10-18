import queryString from 'querystring';
import axios from 'axios';
import config from '@/config';

const parsed = queryString.parse(window.location.search.replace('?', ''));

axios.post(`${config.get('AUTH_SERVICE_URL')}/auth`, {
  code: parsed.code,
}).then((res) => {
  console.log(res.data);
  const accessToken = res.data.access_token;
  localStorage.setItem('access_token', accessToken);
  window.opener.location.reload();
  window.close();
});
