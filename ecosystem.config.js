module.exports = {
  apps: [{
    name: 'dapp-casino',
    script: './main.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-78-54-203.ap-northeast-2.compute.amazonaws.com',
      key: "./awspwd.pem",
      ref: 'origin/master',
      repo: 'git@github.com:Jake-Song/dapp-playlist.git',
      path: '/home/ubuntu/dapp-casino',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
