import { ethers } from "ethers";

export async function createBytes(name) {
  const bytes = ethers.utils.formatBytes32String(name);
  return bytes;
}

export async function parseBytes(bytes) {
  const name = ethers.utils.parseBytes32String(bytes);
  return name;
}
