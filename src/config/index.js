const config = {
  get: key => (
    import.meta.env[`VITE_${key}`]
    || import.meta.env[`VUE_APP_${key}`]
  ),
};
export default config;
