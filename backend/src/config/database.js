require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',   // ⚠️ importante
  user: 'root',
  password: '',        // pon tu password si tienes
  database: 'banking_db',
  port: 3307,
});

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(pool),
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

module.exports = prisma;