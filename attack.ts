// backend/attack.ts
import axios from 'axios';

// ⚠️ වැදගත්: ඔයා Postman එකෙන් ගත්ත Seat ID එක මෙතනට දාන්න
const SEAT_ID_TO_ATTACK = '473f56cc-ed78-4ca5-9b4a-1299450c7958';

const URL = `http://localhost:3000/events/${SEAT_ID_TO_ATTACK}/book`;

async function attack() {
  console.log('🚀 Starting Attack on Seat:', SEAT_ID_TO_ATTACK);

  // 👇 වෙනස් කළා: any[] කියලා දැම්මා
  const requests: any[] = [];

  // Users ලා 20 දෙනෙක් එක පාර request කරනවා
  for (let i = 1; i <= 20; i++) {
    const userId = `User-${i}`;
    console.log(`Preparing request for ${userId}...`);

    requests.push(
      axios
        .post(URL, { userId })
        .then((res) => ({ status: 'SUCCESS', user: userId, data: res.data }))
        .catch((err) => ({
          status: 'FAILED',
          user: userId,
          error: err.response?.data?.message,
        })),
    );
  }

  console.log('🔥 FIRING ALL REQUESTS SIMULTANEOUSLY...');

  const results = await Promise.all(requests);

  const successes = results.filter((r) => r.status === 'SUCCESS');
  const failures = results.filter((r) => r.status === 'FAILED');

  console.log('--- RESULT REPORT ---');
  console.log(`✅ Successful Bookings: ${successes.length}`);
  console.log(`❌ Failed Bookings:     ${failures.length}`);

  if (successes.length > 1) {
    console.log('🚨 CRITICAL BUG FOUND: Double Booking Happened!');
    console.log(
      'Users who got the seat:',
      successes.map((s) => s.user),
    );
  } else {
    console.log('👍 System seems safe (or race condition missed).');
  }
}

attack();
