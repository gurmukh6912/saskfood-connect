import { expect } from "chai";
import { ethers } from "hardhat";
import { FoodDeliveryEscrow } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("FoodDeliveryEscrow", function () {
  let escrow: FoodDeliveryEscrow;
  let owner: HardhatEthersSigner;
  let customer: HardhatEthersSigner;
  let restaurant: HardhatEthersSigner;
  let driver: HardhatEthersSigner;
  let orderId: string;

  beforeEach(async function () {
    [owner, customer, restaurant, driver] = await ethers.getSigners();
    
    const FoodDeliveryEscrow = await ethers.getContractFactory("FoodDeliveryEscrow");
    escrow = await FoodDeliveryEscrow.deploy();
    await escrow.waitForDeployment();

    // Create a unique order ID
    orderId = ethers.id("test-order-" + Date.now());
  });

  describe("Order Creation", function () {
    it("Should create a new order with correct fee distribution", async function () {
      const orderAmount = ethers.parseEther("1.0"); // 1 ETH order
      
      await escrow.connect(customer).createOrder(
        orderId,
        restaurant.address,
        driver.address,
        { value: orderAmount }
      );

      const order = await escrow.getOrder(orderId);
      
      expect(order.customer).to.equal(customer.address);
      expect(order.restaurant).to.equal(restaurant.address);
      expect(order.driver).to.equal(driver.address);
      
      // Check fee calculations (5% platform fee, 10% delivery fee)
      const platformFee = orderAmount * 5n / 100n;
      const deliveryFee = orderAmount * 10n / 100n;
      const restaurantAmount = orderAmount - platformFee - deliveryFee;
      
      expect(order.amount).to.equal(restaurantAmount);
      expect(order.deliveryFee).to.equal(deliveryFee);
      expect(order.platformFee).to.equal(platformFee);
    });
  });

  describe("Order Status Updates", function () {
    beforeEach(async function () {
      await escrow.connect(customer).createOrder(
        orderId,
        restaurant.address,
        driver.address,
        { value: ethers.parseEther("1.0") }
      );
    });

    it("Should allow restaurant to update order status", async function () {
      await escrow.connect(restaurant).updateOrderStatus(orderId, 1); // ACCEPTED
      const order = await escrow.getOrder(orderId);
      expect(order.status).to.equal(1);
    });

    it("Should release payment upon delivery", async function () {
      const initialRestaurantBalance = await ethers.provider.getBalance(restaurant.address);
      const initialDriverBalance = await ethers.provider.getBalance(driver.address);
      
      // Mark order as delivered
      await escrow.connect(restaurant).updateOrderStatus(orderId, 5); // DELIVERED
      
      const finalRestaurantBalance = await ethers.provider.getBalance(restaurant.address);
      const finalDriverBalance = await ethers.provider.getBalance(driver.address);
      
      expect(finalRestaurantBalance).to.be.gt(initialRestaurantBalance);
      expect(finalDriverBalance).to.be.gt(initialDriverBalance);
    });
  });

  describe("Refunds", function () {
    beforeEach(async function () {
      await escrow.connect(customer).createOrder(
        orderId,
        restaurant.address,
        driver.address,
        { value: ethers.parseEther("1.0") }
      );
    });

    it("Should allow owner to refund order", async function () {
      const initialCustomerBalance = await ethers.provider.getBalance(customer.address);
      
      await escrow.connect(owner).refundOrder(orderId);
      
      const finalCustomerBalance = await ethers.provider.getBalance(customer.address);
      expect(finalCustomerBalance).to.be.gt(initialCustomerBalance);
      
      const order = await escrow.getOrder(orderId);
      expect(order.status).to.equal(7); // REFUNDED
    });
  });
}); 