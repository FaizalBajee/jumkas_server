module.exports = {

  apps: [{

    name: "jumkas_server",

    script: "server.js",

    instances: "max",

    exec_mode: "cluster",

    env: {

      NODE_ENV: "production",

      PORT: 3000

    }

  }]

}