import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying FoodDeliveryEscrow contract...");

  // Deploy the contract
  const FoodDeliveryEscrow = await ethers.getContractFactory("FoodDeliveryEscrow");
  const escrow = await FoodDeliveryEscrow.deploy();
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("FoodDeliveryEscrow deployed to:", address);

  // Wait for a few block confirmations to ensure the deployment is confirmed
  console.log("Waiting for block confirmations...");
  await escrow.deploymentTransaction()?.wait(5);

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...");
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("Error verifying contract:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 