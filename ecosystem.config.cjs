module.exports = {
  apps: [{
    name: "uiuxai",
    script: "node_modules/.bin/next",
    args: "start",
    cwd: "/www/wwwroot/uiuxai",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3001,
    },
  }],
};
