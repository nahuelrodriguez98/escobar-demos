export const msalConfig = {
  auth: {
    clientId: "a8820cae-dcc2-44de-8d4f-7ba0c41f456a",
    authority: "https://login.microsoftonline.com/d0b18581-b031-462d-9394-f5dce32e499a",
    redirectUri: `${import.meta.env.FRONTEND_URL}/auth/callback`
  }
};
