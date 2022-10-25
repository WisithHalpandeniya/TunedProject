//to use local db sql expresss...
//whats the diff between server and host
//im guessing host is for online like php admin anf server is for local ??
const config = {
    user: "test1",
    password: "123456789123456789",
    server: "DESKTOP-6BSSVN3",
    database: "SQL Tutorial",
    // dialect: "mysql",
    //maybe remove this?
    options: {
      trustServerCertificate: true,
      trustedConnection: false,
      enableArithAbort: true,
      instancename: 'SQLEXPRESS'
    },
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // },
    port: 1433
  };

  module.exports = config;
  