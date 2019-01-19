let attrs = {
  protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
  host: process.env.NODE_ENV === 'development' ? 'localhost' : 'appgestionescolar.herokuapp.com',
  port: process.env.NODE_ENV === 'production' ? 80 : 3000
};
module.exports = {
  protocol: attrs.protocol,
  host: attrs.host,
  port: attrs.port,
  url: attrs.protocol + '://' + attrs.host + (attrs.port === 80 ? '' : ':' + attrs.port)
}
