export const environment = {
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8082' 
    : `http://${window.location.hostname}:8082`,
};
