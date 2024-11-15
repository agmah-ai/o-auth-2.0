const basicAuth = (req, res, next) => {
    const clientId = req.body.clientId;
    const clientSecret = req.body.client_secret;

    if (!clientId || !clientSecret) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'Missing client credentials' });
    }
    
    if (clientId !== process.env.CLIENT_ID) {
      return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client credentials' });
    }
    if (clientSecret !== process.env.CLIENT_SECRET) {
        return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client credentials' });
      }

    next();
  };

  module.exports = {basicAuth}
