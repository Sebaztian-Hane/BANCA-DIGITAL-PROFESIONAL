const prisma = require('../config/database');

class AdminService {
  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        dni: true,
        phone: true,
        role: true,
        balance: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            sentTransactions: true,
            receivedTransactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return users;
  }
  
  async getUserDetails(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentTransactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            receiver: {
              select: { name: true, email: true }
            }
          }
        },
        receivedTransactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Estadísticas del usuario
    const stats = {
      totalSent: user.sentTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalReceived: user.receivedTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactionCount: user.sentTransactions.length + user.receivedTransactions.length
    };
    
    return { user, stats };
  }
  
  async updateUserStatus(userId, isActive) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });
    
    return user;
  }
  
  async updateUserBalance(userId, amount, action) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    let newBalance;
    if (action === 'add') {
      newBalance = user.balance + amount;
    } else if (action === 'subtract') {
      if (user.balance < amount) {
        throw new Error('Insufficient balance');
      }
      newBalance = user.balance - amount;
    } else {
      throw new Error('Invalid action. Use "add" or "subtract"');
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance }
    });
    
    // Registrar transacción administrativa
    await prisma.transaction.create({
      data: {
        amount,
        type: 'DEPOSIT',
        description: `Admin ${action === 'add' ? 'added' : 'subtracted'} $${amount}`,
        status: 'COMPLETED',
        reference: `ADM-${Date.now()}-${userId}`,
        receiverId: action === 'add' ? userId : null,
        senderId: action === 'subtract' ? userId : null
      }
    });
    
    return { balance: updatedUser.balance };
  }
  
  async getSystemStats() {
    const [
      totalUsers,
      activeUsers,
      totalTransactions,
      totalDeposits,
      totalWithdrawals,
      totalTransfers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        where: { type: 'DEPOSIT', status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { type: 'WITHDRAWAL', status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { type: 'TRANSFER', status: 'COMPLETED' },
        _sum: { amount: true }
      })
    ]);
    
    const totalBalance = await prisma.user.aggregate({
      _sum: { balance: true }
    });
    
    return {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      transactions: {
        total: totalTransactions,
        totalDeposits: totalDeposits._sum.amount || 0,
        totalWithdrawals: totalWithdrawals._sum.amount || 0,
        totalTransfers: totalTransfers._sum.amount || 0
      },
      system: {
        totalBalance: totalBalance._sum.balance || 0
      }
    };
  }
}

module.exports = new AdminService();