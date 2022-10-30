//to use local db sql expresss...
const config = {
    user: "test1",
    password: "123456789123456789",
    server: "DESKTOP-6BSSVN3",
    database: "SQL Tutorial",
    // dialect: "mysql",
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
  