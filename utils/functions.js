import { ethers } from "ethers";

export async function createBytes(name) {
  const bytes = await ethers.utils.formatBytes32String(name);
  return bytes;
}

export async function parseBytes(bytes) {
  const name = await ethers.utils.parseBytes32String(bytes);
  return name;
}
