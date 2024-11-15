const mongoose = require("mongoose");

const defaultOrganizationSchema = new mongoose.Schema(
  {
    name: { type: String },
    domain: [String],
    dbName: { type: String },
  },
  { timestamps: true, autoCreate: false  }
);

module.exports =mongoose.model("allorgs", defaultOrganizationSchema);;
