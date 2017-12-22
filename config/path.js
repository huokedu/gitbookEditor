module.exports = {
  hostPath: process.env.NODE_ENV === 'production' ? 'https://admin.apis.sh' : 'http://192.168.1.99:8000',
  serverPath: process.env.NODE_ENV === 'production' ? 'https://srv.admin.apis.sh' : 'http://192.168.1.99:8808',
  staticPath: process.env.NODE_ENV === 'production' ? 'https://srv.admin.apis.sh' : 'http://192.168.1.99:9999/APIS'
}
