import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();
  
//////////********Deployed a Redis on Railway *****///////////////////////
const redis = createClient({
  url: process.env.REDIS_URL || "redis://default:lVqcQzLyjZiGtxxvmfxZjnAiypHOrbYy@yamanote.proxy.rlwy.net:38857",
});
 
/////////////////******  For connecting redis locally  *******///////////////////////////

// const redis = createClient({ socket: { host: 'localhost', port: 6379 } }); 

redis.on('connect', () => {
  console.log('✅ Connected to Redis (Railway)');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redis.connect();

export default redis;
