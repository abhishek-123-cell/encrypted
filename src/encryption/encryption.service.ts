import { Injectable } from '@nestjs/common';
import * as forge from 'node-forge';
import { v4 as uuidv4 } from 'uuid';
import redis from '../config/redis.config';
import { EncryptDto } from './dto/encrypt.dto';

@Injectable()
export class EncryptionService {
  private userKeys = new Map<string, string>(); // UUID -> privateKey PEM
  private userCounter = new Map<string, number>(); // UUID -> count

  constructor() {
    redis.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });
  }

  // Generate a new RSA key pair
  async generateKeys() {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const uuid = uuidv4();
    this.userKeys.set(uuid, forge.pki.privateKeyToPem(keyPair.privateKey));

    console.log(`🔐 Key generated for UUID: ${uuid}`);

    return {
      uuid,
      publicKey: forge.pki.publicKeyToPem(keyPair.publicKey),
    };
  }

  // Encrypt and store the number
  async encryptAndStore(encryptDto: EncryptDto) {
    const { uuid, publicKey, number } = encryptDto;
    console.log(`📥 Received number ${number} for UUID ${uuid}`);

    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = publicKeyObj.encrypt(number.toString());
    const hexEncrypted = forge.util.bytesToHex(encrypted);

    // Fetch existing values from Redis
    const allKeys = await redis.sMembers(`encrypted:${uuid}`);
    console.log(`🔍 Existing encrypted values for ${uuid}:`, allKeys);

    // Check for uniqueness
    if (!allKeys.includes(hexEncrypted)) {
      console.log('✅ New unique encrypted value. Storing in Redis...');
      await redis.sAdd(`encrypted:${uuid}`, hexEncrypted);
    } else {
      console.log('⚠️ Duplicate encrypted value. Not storing.');
    }

    // Track how many values stored
    const count = this.userCounter.get(uuid) || 0;
    this.userCounter.set(uuid, count + 1);

    // If 15 values stored, decrypt and return sorted
    if (count + 1 === 15) {
        const privateKeyPem = this.userKeys.get(uuid);
        if (!privateKeyPem) {
          throw new Error(`Private key not found for UUID: ${uuid}`);
        }
        
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

      const encryptedValues = await redis.sMembers(`encrypted:${uuid}`);
      const decrypted = encryptedValues.map((enc) =>
        parseFloat(
          forge.util.decodeUtf8(privateKey.decrypt(forge.util.hexToBytes(enc)))
        )
      );

      const sorted = decrypted.sort((a, b) => b - a);

      return {
        message: 'Decryption complete',
        sorted,
      };
    }

    return { message: 'Stored successfully' };
  }
}
