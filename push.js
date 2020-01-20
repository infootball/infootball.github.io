var webPush = require('web-push')

const vapidKeys = {
  publicKey: "BCIbziXwtNsuv6Y_Z1ENCS57WzDMfJX6oF6xfI1mIB5pBSG6OV_5MREqoh6QnGW7Y7cGuhS_IDaPHAsgCf2s1JY",
  privateKey: "LBkp6gNvw5lD51zPEijYwYmC2Sl0l3mR2_rZNwY0Nlo",
}

webPush.setVapidDetails(
  'mailto:rahmatwae5@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

var pushSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/fL4x55TqOGk:APA91bG1UQYRpHi4Xgx08iyaeSqbUQrHQttziCC9Y3EW2WI6cMsI3HJMsI8js3Lsa06sqt_ql5_QsWtejXmo5OHp0GXDnjzyNsIYtyVgeDjhKzr-JFMfo3KQHSSeJaVNU0_pH-f1UzCt",
  keys: {
    p256dh: "BPHEHwFnAE/o1fKWaR7ypFaJElWrFtC3yCSGEsaFLEle9SL8bhttv7eq5/a4GHVKzr4lsPxNJxAvJ9bC4ooPCFo=",
    auth: "ZkW49J4oqb/xXWG9udu/Kw=="
  }
}
var payload = 'Dapatkan informasi seputar dunia sepak bola!!';
var options = {
  gcmAPIKey: "618283944231",
  TTL: 60
}

webPush.sendNotification(pushSubscription, payload, options).catch(err => console.log(err))
