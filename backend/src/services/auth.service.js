const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

class AuthService {
  async register(userData) {
    const { email, password, name, dni, phone, address } = userData;
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { dni }
        ]
      }
    });
    
    if (existingUser) {
      throw new Error('Email or DNI already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        dni,
        phone,
        address,
        role: 'CLIENT',
        balance: 0
      },
      select: {
        id: true,
        email: true,
        name: true,
        dni: true,
        role: true,
        balance: true,
        createdAt: true
      }
    });
    
    // Generar token
    const token = this.generateToken(user);
    
    return { user, token };
  }
  
  async login(credentials) {
    const { email, password } = credentials;
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    if (!user.isActive) {
      throw new Error('Account is disabled');
    }
    
    // Verificar password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Crear objeto usuario sin password
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      balance: user.balance
    };
    
    // Generar token
    const token = this.generateToken(userWithoutPassword);
    
    return { user: userWithoutPassword, token };
  }
  
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }
  
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        dni: true,
        phone: true,
        address: true,
        role: true,
        balance: true,
        createdAt: true
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}

module.exports = new AuthService();