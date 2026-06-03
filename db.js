const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=TodoDB;Trusted_Connection=Yes;",
    options: {
        trustServerCertificate: true
    }
};

async function conectarDB() {
    try {
        await sql.connect(config);
        console.log("Banco conectado 🚀");
    } catch (erro) {
        console.log("Erro ao conectar:", erro);
    }
}

module.exports = { conectarDB, sql };