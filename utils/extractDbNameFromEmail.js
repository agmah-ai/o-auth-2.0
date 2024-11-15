const globalDbModel = require("../model/globalOrgModel");
const { connectToDatabase } = require("./dynamicOrgDbConnection");

const getModelsAndFindDomainFromEmail = async function (username) {
  const extractDomain = username.split("@")[1];
  const checkDomain = await globalDbModel.findOne({
    domain: { $in: [extractDomain] },
  });
  if (!checkDomain) {
    throw new GraphQLError(
      `Organization with domain ${extractDomain} not registered with us.`,
      {
        extensions: {
          code: "404",
        },
      }
    );
  }
  const dbName = checkDomain.dbName;

  const tenantDb = await connectToDatabase(
    dbName,
    `${process.env.MONGOOSE_STRING}/${dbName}`
  );

  const User = tenantDb.model("users");


  return { User, dbName };
};

module.exports = { getModelsAndFindDomainFromEmail };
