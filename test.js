import { error } from 'node:console';
import * as fs from 'node:fs/promises';

// read
export async function readFile(data) {
  try {
    const readData = await fs.readFile(data, 'utf-8');
    console.log(readData);
  } catch (error) {
    console.error(error);
  }
}
// readFile('inputFile.txt');

// write
export async function writeFile(data) {
  try {
    const writeData = await fs.writeFile(data, 'utf-8');
  } catch (error) {
    console.error(error);
  }
}
