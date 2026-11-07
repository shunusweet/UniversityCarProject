// utils/agreementMapper.js
function mapJsonToAgreement(jsonData) {
  return {
    registrationNumber: jsonData.registrationNumber,
    purchaseDate: jsonData.purchaseDate,
    salesDate: jsonData.salesDate,
    email: jsonData.email,
    phone: jsonData.phone,
    purchasePrice: jsonData.purchasePrice?.toString(), // Convert to string if needed
    commissionRate: jsonData.commissionRate,
    commissionAmount: jsonData.commissionAmount,
    agencyFee: jsonData.agencyFee,
    paymentMethod: jsonData.paymentMethod,
    vatType: jsonData.vatType,
    creditMarking: jsonData.creditMarking,
    mileage: jsonData.mileage,
    latestService: jsonData.latestService,
    numberOfKeys: jsonData.numberOfKeys,
    deck: jsonData.deck,
    notes: jsonData.notes,
    creditor: jsonData.creditor,
    depositor: jsonData.depositor,
    creditAmount: jsonData.creditAmount?.toString(), // Convert to string if needed
    name: jsonData.name,
    customerType: jsonData.customer?.type,
    address: jsonData.address,
    birthDate: jsonData.birthDate,
    gender: jsonData.gender,
    insurer: jsonData.insurer,
    insurerType: jsonData.insurerType,
    warrantyProvider: jsonData.warrantyProvider,
    warrantyProduct: jsonData.warrantyProduct,
    socialSecurityNumber: jsonData.customer?.socialSecuityNumber, // Note: typo in your JSON
    organizationNumber: jsonData.customer?.organizationNumber,
    // Trade-in vehicle mapping
    tradeInType: jsonData.tradeInVehicle?.type,
    tradeInRegistrationNumber: jsonData.tradeInVehicle?.registrationNumber,
    tradeInPurchaseDate: jsonData.tradeInVehicle?.purchaseDate,
    tradeInPurchasePrice: jsonData.tradeInVehicle?.purchasePrice,
    tradeInMileage: jsonData.tradeInVehicle?.mileage,
    tradeInCreditMaking: jsonData.tradeInVehicle?.creditMaking
  };
}

module.exports = { mapJsonToAgreement };