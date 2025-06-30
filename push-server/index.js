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

app.post('/api/subscribe', async (req, res) => {
  const sub = req.body;
  console.log('Subscription received:', sub);
  USER_SUBSCRIPTIONS.push(sub);
  res.status(201).json({ message: 'Subscription added successfully' });
});

app.post('/send-push', async (req, res) => {
  const subscription = req.body;

  const payload = JSON.stringify({
    title: 'Test Push Notification',
    body: 'This is a push notification sent from the Node server.',
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(201).json({ message: 'Push sent' });
  } catch (err) {
    console.error('Error sending push:', err);
    res.status(500).json({ error: 'Failed to send push' });
  }
});

app.listen(port, () => {
  console.log(`Push server listening at http://localhost:${port}`);
});
