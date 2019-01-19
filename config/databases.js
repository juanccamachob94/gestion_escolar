/*
* Credenciales para las bases de datos a utilizar en la aplicación bajo los tres ambientes de despliegue.
*/
const mongoose = require('mongoose');
module.exports = {
  mongoDB: {
    no_v: {
      versionKey: false
    },
    getUrlMongoDB: () => {
      let credentials = undefined;
      switch (process.env.NODE_ENV) {
        case 'development':
          credentials = {
            user: "development1",
            password: "development_gestionescolar",
            host: "localhost",
            database: "gestion_escolar",
            port: "27017"
          };
          break;
        case 'test':
          credentials = {
            user: "",
            password: "",
            host: "",
            database: "",
            port: ""
          };
          break;
        case 'production':
        credentials = {
          user: "",
          password: "",
          host: "",
          database: "",
          port: ""
        };
          break;
      }
      if(typeof credentials == "undefined") throw new Error('Environment of deploying not valid');
      return 'mongodb://' + credentials.user + ':' + credentials.password + '@' + credentials.host + ':' + credentials.port + '/' + credentials.database;
    }
  }
};
