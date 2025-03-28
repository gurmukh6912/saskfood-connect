// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FoodDeliveryEscrow is ReentrancyGuard, Ownable {
    struct Order {
        address customer;
        address restaurant;
        address driver;
        uint256 amount;
        uint256 deliveryFee;
        uint256 platformFee;
        OrderStatus status;
        uint256 createdAt;
    }

    enum OrderStatus {
        PENDING,
        ACCEPTED,
        PREPARING,
        READY_FOR_PICKUP,
        PICKED_UP,
        DELIVERED,
        CANCELLED,
        REFUNDED
    }

    mapping(bytes32 => Order) public orders;
    uint256 public platformFeePercent = 5; // 5% platform fee

    event OrderCreated(bytes32 indexed orderId, address customer, address restaurant, uint256 amount);
    event OrderStatusUpdated(bytes32 indexed orderId, OrderStatus status);
    event PaymentReleased(bytes32 indexed orderId, address recipient, uint256 amount);
    event OrderRefunded(bytes32 indexed orderId, address customer, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function createOrder(
        bytes32 orderId,
        address restaurant,
        address driver
    ) external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        require(orders[orderId].customer == address(0), "Order already exists");

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 deliveryFee = (msg.value * 10) / 100; // 10% delivery fee
        
        orders[orderId] = Order({
            customer: msg.sender,
            restaurant: restaurant,
            driver: driver,
            amount: msg.value - platformFee - deliveryFee,
            deliveryFee: deliveryFee,
            platformFee: platformFee,
            status: OrderStatus.PENDING,
            createdAt: block.timestamp
        });

        emit OrderCreated(orderId, msg.sender, restaurant, msg.value);
    }

    function updateOrderStatus(bytes32 orderId, OrderStatus status) external {
        Order storage order = orders[orderId];
        require(order.customer != address(0), "Order does not exist");
        require(
            msg.sender == order.restaurant || msg.sender == order.driver || msg.sender == owner(),
            "Unauthorized"
        );

        order.status = status;
        emit OrderStatusUpdated(orderId, status);

        if (status == OrderStatus.DELIVERED) {
            releasePayment(orderId);
        }
    }

    function releasePayment(bytes32 orderId) private {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.DELIVERED, "Order not delivered");

        // Transfer restaurant payment
        (bool restaurantSuccess,) = payable(order.restaurant).call{value: order.amount}("");
        require(restaurantSuccess, "Restaurant payment failed");

        // Transfer driver payment
        (bool driverSuccess,) = payable(order.driver).call{value: order.deliveryFee}("");
        require(driverSuccess, "Driver payment failed");

        // Transfer platform fee
        (bool platformSuccess,) = payable(owner()).call{value: order.platformFee}("");
        require(platformSuccess, "Platform fee transfer failed");

        emit PaymentReleased(orderId, order.restaurant, order.amount);
        emit PaymentReleased(orderId, order.driver, order.deliveryFee);
        emit PaymentReleased(orderId, owner(), order.platformFee);
    }

    function refundOrder(bytes32 orderId) external onlyOwner {
        Order storage order = orders[orderId];
        require(order.status != OrderStatus.DELIVERED, "Order already delivered");
        require(order.status != OrderStatus.REFUNDED, "Order already refunded");

        uint256 refundAmount = order.amount + order.deliveryFee + order.platformFee;
        order.status = OrderStatus.REFUNDED;

        (bool success,) = payable(order.customer).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit OrderRefunded(orderId, order.customer, refundAmount);
    }

    function getOrder(bytes32 orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    function updatePlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 10, "Fee too high");
        platformFeePercent = newFeePercent;
    }
}