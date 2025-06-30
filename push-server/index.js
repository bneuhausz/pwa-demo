import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { USER_SUBSCRIPTIONS } from './in-memory-db.js';

dotenv.config();

const app = express();
const port = 3000;

webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.use(bodyParser.json());

app.post('/api/subscribe', (req, res) => {
  const sub = req.body;
  console.log('Subscription received:', sub);
  USER_SUBSCRIPTIONS.push(sub);
  res.status(201).json({ message: 'Subscription added successfully' });
});

app.post('/api/send-push', (req, res) => {
  const payload = {
    'notification': {
      'title': 'Test Push Notification',
      'body': 'This is a push notification sent from the Node server.',
      'icon': 'icons/icon-192x192.png',
      'vibrate': [100, 50, 100],
      'data': {
        'dateOfArrival': Date.now(),
        'primaryKey': 1,
      },
      'actions': [
        {
          'action': 'explore',
          'title': 'Go to the site',
        },
      ],
    }
  }

  console.log('Sending push notification to all subscribers');
  Promise.all(USER_SUBSCRIPTIONS.map(sub => webpush.sendNotification(sub, JSON.stringify(payload))))
    .then(() => res.status(200).json({ message: 'Notification sent' }))
    .catch(err => {
      console.error('Error sending push notifications:', err);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Push server listening at http://localhost:${port}`);
});
