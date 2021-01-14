/**
 * PORT
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Environment
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Data Base
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://devook:5yhgtfbYZjt36np8@cluster0.vgt31.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
