"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var RATES = {
    api_cost1: 0.01,
    api_cost2: 0.008,
    storage: 0.25,
    compute: 0.05
};
function isValidEntry(entry) {
    return (typeof entry.CustomerId == 'string' &&
        typeof entry.API_Calls == 'number' && entry.API_Calls >= 0 &&
        typeof entry.Storage_GB == 'number' && entry.Storage_GB >= 0 &&
        typeof entry.Compute_Minutes == 'number' && entry.Compute_Minutes >= 0);
}
function calculateCharges(entry) {
    var cost = 0;
    if (entry.API_Calls > 10000) {
        cost = entry.API_Calls * RATES.api_cost2;
    }
    else {
        cost = entry.API_Calls * RATES.api_cost1;
    }
    return {
        api: cost,
        storage: entry.Storage_GB * RATES.storage,
        compute: entry.Compute_Minutes * RATES.compute
    };
}
function printInvoice(entry, charges) {
    var total = charges.api + charges.storage + charges.compute;
    console.log("Invoice for Customer: ".concat(entry.CustomerId));
    console.log('-----------------------------');
    console.log("API Calls: ".concat(entry.API_Calls, " calls -> $").concat(charges.api.toFixed(2)));
    console.log("Storage: ".concat(entry.Storage_GB, " GB -> $").concat(charges.storage.toFixed(2)));
    console.log("Compute Time: ".concat(entry.Compute_Minutes, " minutes -> $").concat(charges.compute.toFixed(2)));
    console.log('-----------------------------');
    console.log("Total Due: $".concat(total.toFixed(2), "\n"));
}
function main(inputDir) {
    var defaultPath = path.join(__dirname, 'usage-data.json');
    var filePath;
    if (inputDir) {
        var customPath = path.join(inputDir, 'usage-data.json');
        if (fs.existsSync(customPath)) {
            filePath = customPath;
        }
        else {
            console.warn("Provided path is invalid or file not found at: ".concat(customPath));
            console.warn("Falling back to default path: ".concat(defaultPath));
            filePath = defaultPath;
        }
    }
    else {
        filePath = defaultPath;
    }
    var data;
    try {
        var file = fs.readFileSync(filePath, 'utf8');
        data = JSON.parse(file);
    }
    catch (error) {
        console.error("Error reading or parsing usage-data.json:", error.message);
        return;
    }
    if (!Array.isArray(data)) {
        console.error("Invalid JSON: Expected an array of entries.");
        return;
    }
    data.forEach(function (entry, index) {
        var _a;
        if (isValidEntry(entry)) {
            var charges = calculateCharges(entry);
            printInvoice(entry, charges);
        }
        else {
            var id = (_a = entry.CustomerId) !== null && _a !== void 0 ? _a : "Unknown (Entry #".concat(index + 1, ")");
            console.warn("Skipped invalid entry: Missing or invalid fields for CustomerId: ".concat(id));
        }
    });
}
var directoryFromArgs = process.argv[2];
main(directoryFromArgs);
