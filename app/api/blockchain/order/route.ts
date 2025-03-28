import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "@reown/appkit/networks";

// Initialize Viem public client for transaction verification
const publicClient = createPublicClient({
  chain: process.env.NODE_ENV === "production" ? mainnet : sepolia,
  transport: http(process.env.ETHEREUM_RPC_URL),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, amount, txHash } = await req.json();

    if (!txHash) {
      return NextResponse.json(
        { error: "Transaction hash is required" },
        { status: 400 }
      );
    }

    // Get order details from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: true,
        delivery: {
          include: {
            driver: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash: txHash as `0x${string}`,
      confirmations: 2 // Wait for 2 confirmations for better security
    });

    if (!receipt.status) {
      throw new Error("Transaction failed");
    }

    // Update order status in database
    await prisma.order.update({
      where: { id: orderId },
      data: {
        blockchainTxHash: txHash,
        status: "PENDING",
        paymentStatus: "PAID"
      }
    });

    return NextResponse.json({ 
      success: true,
      txHash
    });
  } catch (error) {
    console.error("Blockchain order error:", error);
    return NextResponse.json(
      { error: "Failed to process blockchain order" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    // Initialize provider and contract
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // Update order status on blockchain
    const tx = await contract.updateOrderStatus(ethers.id(orderId), status);
    await tx.wait();

    // Update order status in database
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    return NextResponse.json({ 
      success: true,
      txHash: tx.hash
    });
  } catch (error) {
    console.error("Blockchain status update error:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}