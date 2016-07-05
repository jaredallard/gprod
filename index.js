/**
 * Remind me to commit for once.
 **/

const Pushbullet = require('pushbullet');
const Github     = require('github');
const moment     = require('moment');

let API_KEY = require('./config.json').API_KEY;

const Pusher = new Pushbullet(API_KEY);
const github = new Github();

let sendPush = (msg) => {
  console.log('Send Push with:', msg);
  Pusher.note({}, 'Github Push Tracker', msg, (err, response) => {
    if(err) {
      console.warn('Failed to send push notice.')
    }
  });
}


let GLOBAL_PUSH = false;


const TIMER = () => {
  github.activity.getEventsForUser({
    user: 'jaredallard'
  }, (err, res) => {
    let pushes = [];
    res.forEach(event => {
      if(event.type === 'PushEvent') {
        pushes.push({
          repo: event.repo.name,
          date: event.created_at,
          type: 'push',
          date_formated:  moment(event.created_at).format('DD-MM-YYYY HH:mm:ss')
        })
      }
    })

    let fullday    = false;
    let neardayh   = false;
    let neardaytwo = false;
    pushes.forEach(push => {
      let from_now = moment(push.date).fromNow();

      if(from_now.match(/hours ago/)) {
        GLOBAL_PUSH = false; // reset 1 day alert.
        let howmany = parseInt(/(\d?\d) hours ago/g.exec(from_now)[1]);

        if(howmany >= 20  {
          if(howmany == 20 || howmany == 22) {
            sendPush('Hurry up, you have only a few more hours left to push a commit.')
          }
        } else if(howmany >= 12 && neardayh === false) {
          neardayh = true;
          sendPush('It\'s been half a day since you last pushed a commit.')
        }
      } else if(from_now.match(/day ago/) && GLOBAL_PUSH === false) {
        GLOBAL_PUSH = true;
        sendPush('It\'s been a day since you last pushed a commit :(')
      }
    })
  })
}

TIMER();
setInterval(TIMER, 60000)
