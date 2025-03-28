"use client";

import React, { useState, useEffect } from "react";
import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitNetworkCore } from '@reown/appkit/react';
import { BrowserProvider, JsonRpcSigner, formatEther, parseEther, Contract } from 'ethers';
import type { Provider } from '@reown/appkit-adapter-wagmi';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Wallet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mainnet, sepolia } from "@reown/appkit/networks";

interface BlockchainPaymentProps {
  amount: number;
  orderId: string;
  onPaymentComplete: () => void;
}

const SUPPORTED_CHAINS = [mainnet.id, sepolia.id] as const;
const ESCROW_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;

export function BlockchainPayment({ amount, orderId, onPaymentComplete }: BlockchainPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { toast } = useToast();

  // Check if user has sufficient balance
  const hasSufficientBalance = balance && parseFloat(balance) >= amount;

  // Fetch balance when address changes
  const updateBalance = async () => {
    if (isConnected && address && walletProvider) {
      try {
        const provider = new BrowserProvider(walletProvider);
        const balance = await provider.getBalance(address);
        setBalance(formatEther(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    } else {
      setBalance(null);
    }
  };

  // Update balance when connection state changes
  useEffect(() => {
    updateBalance();
    // Set up an interval to update the balance
    const interval = setInterval(updateBalance, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [isConnected, address, walletProvider]);

  const handlePayment = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to proceed with payment",
        variant: "destructive",
      });
      return;
    }

    if (!chainId || !SUPPORTED_CHAINS.includes(chainId as typeof SUPPORTED_CHAINS[number])) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Ethereum Mainnet or Sepolia testnet",
        variant: "destructive",
      });
      return;
    }

    if (!hasSufficientBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${amount} ETH in your wallet`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      
      // Create contract instance
      const contract = new Contract(
        ESCROW_CONTRACT_ADDRESS as string,
        [
          {
            name: "createOrder",
            type: "function",
            stateMutability: "payable",
            inputs: [
              { name: "orderId", type: "bytes32" },
              { name: "restaurant", type: "address" },
              { name: "driver", type: "address" }
            ],
            outputs: []
          }
        ],
        signer
      );

      // Send transaction
      const tx = await contract.createOrder(
        `0x${Buffer.from(orderId).toString("hex")}`,
        "0x0000000000000000000000000000000000000000", // Replace with actual restaurant address
        "0x0000000000000000000000000000000000000000", // Replace with actual driver address if available
        { value: parseEther(amount.toString()) }
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Update order status in the backend
      const response = await fetch("/api/blockchain/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId, 
          amount,
          txHash: tx.hash 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully",
      });

      onPaymentComplete();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  // Network warning
  const showNetworkWarning = isConnected && chainId && !SUPPORTED_CHAINS.includes(chainId as typeof SUPPORTED_CHAINS[number]);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Crypto Payment</h2>
      
      {showNetworkWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please switch to Ethereum Mainnet or Sepolia testnet
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {!isConnected ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => open()}
            disabled={Boolean(isProcessing)}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Connect Wallet
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connected Wallet</span>
              <span className="text-sm font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-sm">
                {balance ? `${balance} ETH` : "Loading..."}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount to Pay</span>
              <span className="text-sm font-semibold">{amount} ETH</span>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => open()}
            >
              Switch Wallet
            </Button>

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={Boolean(isProcessing || !hasSufficientBalance || showNetworkWarning)}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!hasSufficientBalance ? "Insufficient Balance" : `Pay ${amount} ETH`}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}