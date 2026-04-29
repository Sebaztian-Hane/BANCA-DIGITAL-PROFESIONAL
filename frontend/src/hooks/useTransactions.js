import { useState, useEffect } from 'react';
import { transactionAPI } from '../api/endpoints/transaction.api';
import toast from 'react-hot-toast';

export const useTransactions = (initialLimit = 20) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: initialLimit,
    offset: 0,
    hasMore: true
  });

  const fetchTransactions = async (offset = 0) => {
    setLoading(true);
    try {
      const response = await transactionAPI.getHistory({
        limit: pagination.limit,
        offset
      });
      const { transactions: newTransactions, pagination: pag } = response.data.data;
      
      if (offset === 0) {
        setTransactions(newTransactions);
      } else {
        setTransactions(prev => [...prev, ...newTransactions]);
      }
      
      setPagination(pag);
    } catch (error) {
      toast.error('Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchTransactions(pagination.offset + pagination.limit);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    pagination,
    fetchTransactions,
    loadMore
  };
};