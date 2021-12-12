module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Admin@123",
    DB: "dbCompany",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
//   port: 5432,