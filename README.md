# NestJS Application

A NestJS application that integrates with Redis to encrypt, store, and sort unique numeric values.

## Features

- Generates RSA key pairs for each user (UUID).
- Encrypts numeric inputs using the user's public key.
- Stores encrypted values in Redis (ensuring uniqueness).
- Decrypts and sorts the top 15 unique values when 15 values are entered.
- Deployable on Heroku with Redis hosted on Railway.

## Tech Stack

- **NestJS**: A framework for building scalable and maintainable server-side applications.
- **Redis**: In-memory data store for storing encrypted values.
- **node-forge**: Library used for generating RSA key pairs and encryption.
- **ioredis**: Redis client for Node.js.
- **UUID**: For generating unique identifiers for users.
- **TypeScript**: Used for development.

## Setup Instructions

npm run start:dev
