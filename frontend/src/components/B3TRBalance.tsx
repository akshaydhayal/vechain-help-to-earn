import React, { useState, useEffect } from 'react';
import { useWallet } from './ClientOnlyVeChainKit';
import { vechainRewardService } from '../utils/vechainRewardService';

interface B3TRBalanceProps {
  showUserBalance?: boolean;
  showWebsiteBalance?: boolean;
  className?: string;
}

export function B3TRBalance({ 
  showUserBalance = true, 
  showWebsiteBalance = true, 
  className = "" 
}: B3TRBalanceProps) {
  const { account } = useWallet();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [websiteBalance, setWebsiteBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account) {
        setUserBalance(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch website balance
        if (showWebsiteBalance) {
          console.log('🔍 Fetching website balance...');
          const websiteBal = await vechainRewardService.getVeBetterDAOBalance();
          console.log('📊 Website balance received:', websiteBal);
          setWebsiteBalance(websiteBal);
        }

        // Fetch user balance
        if (showUserBalance && account) {
          console.log('🔍 Fetching user balance for:', account);
          const userBal = await vechainRewardService.getUserB3TRBalance(account);
          console.log('📊 User balance received:', userBal);
          setUserBalance(userBal);
        } else if (showUserBalance && !account) {
          setUserBalance(0);
        }

      } catch (error) {
        console.error('Failed to fetch B3TR balances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [account, showUserBalance, showWebsiteBalance]);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse bg-gray-700 h-6 w-16 rounded"></div>
        <div className="animate-pulse bg-gray-700 h-6 w-20 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showUserBalance && account && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-300 font-mono">
            Your B3TR: <span className="font-bold text-blue-200">{userBalance.toFixed(1)}</span>
          </span>
        </div>
      )}
      
      {showWebsiteBalance && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-300 font-mono">
            Total Pool: <span className="font-bold text-green-200">{websiteBalance.toFixed(1)}</span>
          </span>
        </div>
      )}
    </div>
  );
}

// Compact version for navbar
export function B3TRBalanceCompact() {
  return (
    <B3TRBalance 
      showUserBalance={true} 
      showWebsiteBalance={false}
      className="text-xs"
    />
  );
}

// Full version for platform stats
export function B3TRBalanceFull() {
  return (
    <B3TRBalance 
      showUserBalance={true} 
      showWebsiteBalance={true}
      className="text-sm"
    />
  );
}
