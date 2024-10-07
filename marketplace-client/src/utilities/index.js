import { ethers } from 'ethers';

/**
 * Connects to a contract on a local Hardhat node or other network
 * @param {string} contractAddress - The address of the contract
 * @param {object} contractABI - The ABI of the contract
 * @param {string} [providerUrl='http://127.0.0.1:8545'] - The provider URL (default is local Hardhat node)
 * @returns {ethers.Contract} - An instance of the contract
 */
export const connectToContract = async (contractAddress, contractABI, signer) => {
  try {
    
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  } catch (error) {
    console.error('Error connecting to contract:', error);
    throw error;
  }
};

export const getLocalSigner = async (providerUrl = 'http://127.0.0.1:8545') => {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  let retries = 3;
  while (retries > 0) {
    try {
      const signer = await provider.getSigner();
      return signer;
    } catch (error) {
      if (retries === 1) {
        console.error('Error getting signer:', error);
        throw error;
      }
      retries--;
      console.log(`Retrying... (${3 - retries}/3)`);
      await new Promise(res => setTimeout(res, 1000)); // wait 1 second before retrying
    }
  }
};
