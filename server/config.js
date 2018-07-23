'use strict';



// Autodesk Forge configuration
module.exports = {
  // set environment variables or hard-code here
  credentials: {
    client_id: "gcoaVZ4yUxGWflpZ1T7NYlwRmduMk89X",
    client_secret: "Mkm0noVsDOALEpWN",
    callback_url: "http://localhost:3000/api/forge/callback/oauth"
  },

  // Required scopes for your application on server-side
  scopeInternal: ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'],
  // Required scope of the token sent to the client
  scopePublic: ['viewables:read']
};