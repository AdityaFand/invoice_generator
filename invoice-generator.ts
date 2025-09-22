import * as fs from 'fs';
import * as path from 'path';

interface CustomerUsage {
  CustomerId: string;
  API_Calls: number;
  Storage_GB: number;
  Compute_Minutes: number;
}

const RATES = {
  api_cost1: 0.01,
  api_cost2: 0.008,
  storage: 0.25,
  compute: 0.05
};

function isValidEntry(entry: any): entry is CustomerUsage {
  return (
    typeof entry.CustomerId == 'string' &&
    typeof entry.API_Calls == 'number'  &&
    typeof entry.Storage_GB == 'number' &&
    typeof entry.Compute_Minutes == 'number'
  );
}

function calculateCharges(entry: CustomerUsage) {
  let cost = 0;
  if(entry.API_Calls > 10000){
    cost = entry.API_Calls * RATES.api_cost2;
  }else{
    cost = entry.API_Calls * RATES.api_cost1;
  }
  return {
    api: cost,
    storage: entry.Storage_GB * RATES.storage,
    compute: entry.Compute_Minutes * RATES.compute
  };
}

function printInvoice(entry: CustomerUsage, charges: ReturnType<typeof calculateCharges>) {
  const total = charges.api + charges.storage + charges.compute;

  console.log(`Invoice for Customer: ${entry.CustomerId}`);
  console.log('-----------------------------');
  console.log(`API Calls: ${entry.API_Calls} calls -> $${charges.api.toFixed(2)}`);
  console.log(`Storage: ${entry.Storage_GB} GB -> $${charges.storage.toFixed(2)}`);
  console.log(`Compute Time: ${entry.Compute_Minutes} minutes -> $${charges.compute.toFixed(2)}`);
  console.log('-----------------------------');
  console.log(`Total Due: $${total.toFixed(2)}\n`);
}

function main(inputDir?: string) {
  const defaultPath = path.join(__dirname, 'usage-data.json');

  let filePath: string;
  if (inputDir) {
    const customPath = path.join(inputDir, 'usage-data.json');
    if (fs.existsSync(customPath)) {
      filePath = customPath;
    } else {
      console.warn(`Provided path is invalid or file not found at: ${customPath}`);
      console.warn(`Falling back to default path: ${defaultPath}`);
      filePath = defaultPath;
    }
  } else {
    filePath = defaultPath;
  }

  let data: any;

  try {
    const file = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(file);
  } catch (error: any) {
    console.error("Error reading or parsing usage-data.json:", error.message);
    return;
  }

  if (!Array.isArray(data)) {
    console.error("Invalid JSON: Expected an array of entries.");
    return;
  }

  data.forEach((entry, index) => {
    if (isValidEntry(entry)) {
      const charges = calculateCharges(entry);
      printInvoice(entry, charges);
    } else {
      const id = entry.CustomerId ?? `Unknown (Entry #${index + 1})`;
      console.warn(`Skipped invalid entry: Missing or invalid fields for CustomerId: ${id}`);
    }
  });
}

const directoryFromArgs = process.argv[2];

main(directoryFromArgs);
