const fs = require('fs');
const iconv = require('iconv-lite');

/**
 * Write vehicles to .gen file with latin1 encoding
 * @param {Array<Object>} vehicles
 * @param {string} dealerName
 */
async function writeGenFile(vehicles, dealerName) {
  const name = `${dealerName}.gen`;
  const lines = vehicles.map(v => [
    v.vin, v.regnr, v.brand, v.model, v.trim,
    v.firstTrafficMonth, v.modelYear, v.mileage, v.price,
    v.color, v.gearbox, v.fuel, v.equipment,
    v.bodyType, v.powerKw, v.isNew ? 1 : 0,
    v.equipmentDetails || ''
  ].join(';'));

  const content = lines.join('\n');
  const buffer = iconv.encode(content, 'latin1');

  await fs.promises.writeFile(name, buffer);
  return name;
}
