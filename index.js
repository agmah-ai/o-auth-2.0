const oauth2orize = require('oauth2orize');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));

const { basicAuth } = require("./middleware/clientAuth");
const { getModelsAndFindDomainFromEmail } = require("./utils/extractDbNameFromEmail")

dotenv.config();

const server = oauth2orize.createServer();


// password grant type for OAuth2
server.exchange(oauth2orize.exchange.password((_, username, password, scope, done) => {
  (async () => {
    try {
      if (!username) {
        throw { status: 400, message: 'Missing user email credentials.' };
      }
      if (!password) {
        throw { status: 400, message: 'Missing user password credentials.' };
      }
      const { User, dbName } = await getModelsAndFindDomainFromEmail(username);

      const checkEmail = await User.findOne({ email: username });
      if (!checkEmail) {
        throw { status: 400, message: 'The provided email is incorrect. Check your email address and try again.' };
      }
      if (checkEmail.isDeleted) {
        throw { status: 400, message: 'Access Denied: You are no longer a member of this organization.' };
      }

      const checkPassword = await bcrypt.compare(password, checkEmail.password);
      if (!checkPassword) {
        throw { status: 400, message: 'Access Denied: Invalid password.' };
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: checkEmail._id, dbName: dbName },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const refreshToken = jwt.sign(
        { userId: checkEmail._id, dbName: dbName },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
      );
      const addAccessAndRefreshTokenInDb = await User.findByIdAndUpdate(
        checkEmail._id,
        { accessToken: accessToken, refreshToken: refreshToken },
        { new: true }
      )

      // Call done with tokens
      done(null, accessToken, refreshToken);
    } catch (error) {
      // Propagate errors through done
      done(null, false, {
        error: 'invalid_request',
        error_description: error.message || 'An unexpected error occurred.',
      });
    }
  })();
}));



app.post('/auth/token', basicAuth, (req, res, next) => {
  server.token()(req, res, next);
}, server.errorHandler());

mongoose
  .connect(`${process.env.MONGOOSE_STRING}/globalDb`)
  .then(() => console.log("🚀 Connected to Global-Database"))
  .catch((err) => console.error(err.message));

app.listen(process.env.PORT, () => {
  console.log(`OAuth server listening on port ${process.env.PORT}`);
});
