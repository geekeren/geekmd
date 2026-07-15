import axios from 'axios';
import config from '@/config';

const params = new URLSearchParams(window.location.search);

axios.post(`${config.get('AUTH_SERVICE_URL')}/auth`, {
  code: params.get('code'),
}).then((res) => {
  console.log(res.data);
  const accessToken = res.data.access_token;
  localStorage.setItem('access_token', accessToken);
  window.opener.location.reload();
  window.close();
});
