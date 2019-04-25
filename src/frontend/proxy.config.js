var PROXY_CONFIG = [
  {
    context: [
      "/login",
      "/logout",
      "/currentuser",
      "/api",
      "/openapi",
      "/ws",
      "/healthz",
      "/session"
    ],
    target: "http://test.qihoo.cloud",
    secure: false,
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
