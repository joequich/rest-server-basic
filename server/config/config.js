/**
 * PORT
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Environment
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Expiration of token
 * 60 seconds
 * 60 minutes
 * 24 hours
 * 30 days
 */

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

 /**
 * Seed
 */

process.env.SEED = process.env.SEED || 'this-is-the-seed-of-development';

/**
 * Data Base
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
