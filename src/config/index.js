const config = {
  get: key => (process.env[`VUE_APP_${key}`]),
};
export default config;
