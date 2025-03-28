"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote, Bitcoin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface PaymentMethodProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}

export function PaymentMethod({ paymentMethod, onPaymentMethodChange }: PaymentMethodProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [transactionId, setTransactionId] = useState("");
  
  // Mock data - in a real app, you would fetch this from an API
  const cryptoPrices = {
    bitcoin: 60421.33,
    ethereum: 3254.78,
    usdt: 1.00,
    usdc: 1.00,
    bnb: 574.92
  };
  
  const orderAmount = 99.95; // Sample order amount in USD
  const cryptoAmount = selectedCrypto ? (orderAmount / cryptoPrices[selectedCrypto as keyof typeof cryptoPrices]).toFixed(6) : "0";
  
  // Mock wallet addresses - in production, these would be generated per transaction
  const walletAddresses = {
    bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ethereum: "0x7F367cC41522cE07553e823bf3be79A889DEbe1B",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    bnb: "bnb1u9j9hkst6jj952yncuvfgapl5syjjrqakxk3vu"
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
      <RadioGroup
        value={paymentMethod}
        onValueChange={onPaymentMethodChange}
        className="space-y-4"
      >
        <div className="flex items-center space-x-4 border rounded-lg p-4">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
            <CreditCard className="h-5 w-5" />
            Credit/Debit Card
          </Label>
        </div>
        <div className="flex items-center space-x-4 border rounded-lg p-4">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
            <Banknote className="h-5 w-5" />
            Cash on Delivery
          </Label>
        </div>
        <div className="flex items-center space-x-4 border rounded-lg p-4">
          <RadioGroupItem value="crypto" id="crypto" />
          <Label htmlFor="crypto" className="flex items-center gap-2 cursor-pointer">
            <Bitcoin className="h-5 w-5" />
            Cryptocurrency
          </Label>
        </div>
      </RadioGroup>

      {paymentMethod === "card" && (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" type="password" />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "crypto" && (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="cryptoType">Select Cryptocurrency</Label>
            <Select 
              value={selectedCrypto} 
              onValueChange={(value) => setSelectedCrypto(value)}
            >
              <SelectTrigger id="cryptoType" className="w-full">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                <SelectItem value="usdt">Tether (USDT)</SelectItem>
                <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                <SelectItem value="bnb">Binance Coin (BNB)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="walletAddress" className="flex items-center justify-between">
              Wallet Address
              <span className="text-xs text-gray-500">Send exact amount to this address</span>
            </Label>
            <Input 
              id="walletAddress" 
              className="mt-1 font-mono text-sm" 
              readOnly 
              value={walletAddresses[selectedCrypto as keyof typeof walletAddresses]} 
            />
            <p className="text-xs text-gray-500 mt-1">Please ensure you're sending to the correct network</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-900">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Conversion Rate:</span>
              <span className="text-sm">
                1 {selectedCrypto.toUpperCase()} = ${cryptoPrices[selectedCrypto as keyof typeof cryptoPrices].toLocaleString()} USD
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Amount Due:</span>
              <span className="text-sm">{cryptoAmount} {selectedCrypto.toUpperCase()}</span>
            </div>
            <div className="mt-4">
              <Label htmlFor="transactionId">Transaction ID (after payment)</Label>
              <Input 
                id="transactionId" 
                placeholder="Enter transaction hash/ID" 
                className="mt-1"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your transaction ID after sending payment for verification
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            <p>Payment will be marked as complete after blockchain confirmation (typically 1-6 confirmations).</p>
          </div>
        </div>
      )}
    </Card>
  );
}