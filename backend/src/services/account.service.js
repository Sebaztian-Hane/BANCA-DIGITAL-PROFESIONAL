const prisma = require('../config/database');

class AccountService {
  async getBalance(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true, name: true, email: true }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  async deposit(userId, amount) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    const result = await prisma.$transaction(async (prisma) => {
      // Actualizar balance
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } }
      });
      
      // Crear transacción
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          type: 'DEPOSIT',
          description: `Deposit of $${amount}`,
          status: 'COMPLETED',
          reference: `DEP-${Date.now()}-${userId}`,
          receiverId: userId
        }
      });
      
      return { balance: updatedUser.balance, transaction };
    });
    
    return result;
  }
  
  async withdraw(userId, amount) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    // Verificar balance suficiente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });
    
    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    const result = await prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      });
      
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          type: 'WITHDRAWAL',
          description: `Withdrawal of $${amount}`,
          status: 'COMPLETED',
          reference: `WIT-${Date.now()}-${userId}`,
          senderId: userId
        }
      });
      
      return { balance: updatedUser.balance, transaction };
    });
    
    return result;
  }
}

module.exports = new AccountService();