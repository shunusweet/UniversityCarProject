const fs = require('fs');
const path = require('path');

const writeGenFile = async (vehicles, dealerName) => {
  const safeDealerName = String(dealerName || 'Dealer').replace(/\s+/g, '_');
  const fileName = `${safeDealerName}_inventory_${Date.now()}.json`;
  const filePath = path.join(__dirname, '..', 'exported', fileName);

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, JSON.stringify(vehicles, null, 2));

  return filePath;
};


module.exports = writeGenFile;
