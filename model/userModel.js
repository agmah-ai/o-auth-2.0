const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    accessToken: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    fname: {
      type: String,
      default: null,
    },
    lname: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    updatedAt: {
      type: Date,
    },
    OrganizationRole: {
      type: String,
      default: "Organization viewer",
    },
    projectAccess: [
      {
        type: objectId,
        ref: "projects",
      },
    ],
    recentProjects: [
      {
        type: objectId,
        ref: "projects",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    tncChecked: {
      type: Boolean,
      default: false,
    },
    linkToken: { type: String },
    isActivated: {
      type: Boolean,
      default: false,
    },
    invitedBy: {
      type: String,
      default: null,
    },
  },

  { timestamps: true, autoCreate: false }
);
module.exports = {userSchema};
