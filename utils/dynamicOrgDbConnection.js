const mongoose = require("mongoose");
const { userSchema } = require("../model/userModel");


const tenantIdToConnection = {};

const connectToDatabase = async (dbName, uri) => {
    if (!tenantIdToConnection[dbName]) {
        try {
            const connection = await mongoose
                .createConnection(uri, { maxPoolSize: 10, minPoolSize: 5 })
                .asPromise();

            const admin = connection.db.admin();
            const databasesList = await admin.listDatabases();
            const dbExists = databasesList.databases.some((db) => db.name === dbName);

            if (!dbExists) {
                console.error(
                    `Database ${dbName} does not exist. Connection not created.`
                );
                await connection.close();
                return null;
            }
            connection.model("users", userSchema);

            tenantIdToConnection[dbName] = connection;

        } catch (error) {
            console.error(`Failed to connect to database ${dbName}: `, error);
        }
    }
    return tenantIdToConnection[dbName];
};
module.exports = {
    connectToDatabase
};
