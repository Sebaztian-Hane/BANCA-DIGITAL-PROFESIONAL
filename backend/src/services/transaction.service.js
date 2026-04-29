const prisma = require('../config/database');

class TransactionService {
  async transfer(senderId, toEmail, amount, description) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    // Verificar que no se transfiera a sí mismo
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { email: true, balance: true }
    });
    
    if (sender.email === toEmail) {
      throw new Error('Cannot transfer to yourself');
    }
    
    // Buscar receptor
    const receiver = await prisma.user.findUnique({
      where: { email: toEmail }
    });
    
    if (!receiver) {
      throw new Error('Receiver not found');
    }
    
    // Verificar balance suficiente
    if (sender.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Realizar transferencia
    const result = await prisma.$transaction(async (prisma) => {
      // Debitar del remitente
      const updatedSender = await prisma.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } }
      });
      
      // Acreditar al receptor
      const updatedReceiver = await prisma.user.update({
        where: { id: receiver.id },
        data: { balance: { increment: amount } }
      });
      
      // Crear transacción
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          type: 'TRANSFER',
          description: description || `Transfer to ${receiver.name}`,
          status: 'COMPLETED',
          reference: `TRF-${Date.now()}-${senderId}-${receiver.id}`,
          senderId,
          receiverId: receiver.id
        },
        include: {
          sender: {
            select: { name: true, email: true }
          },
          receiver: {
            select: { name: true, email: true }
          }
        }
      });
      
      return {
        balance: updatedSender.balance,
        transaction
      };
    });
    
    return result;
  }
  
  async getTransactionHistory(userId, limit = 50, offset = 0) {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: { name: true, email: true }
        },
        receiver: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });
    
    const total = await prisma.transaction.count({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    });
    
    return {
      transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }
  
  async getTransactionById(transactionId, userId) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: { name: true, email: true }
        },
        receiver: {
          select: { name: true, email: true }
        }
      }
    });
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return transaction;
  }
}

module.exports = new TransactionService();