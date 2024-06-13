// import { ClientSecretCredential } from '@azure/identity';
// import { CertificateClient } from '@azure/keyvault-certificates';

// export async function getRootCA() {
//   const certificateName = process.env.ROOT_CERTIFICATE_NAME;
//   const azureTenantId = process.env.AZURE_TENANT_ID;
//   const azureClientId = process.env.AZURE_CLIENT_ID;
//   const azureClientSecret = process.env.AZURE_CLIENT_SECRET;
//   try {
//     if (azureTenantId && azureClientId && azureClientSecret) {
//       const credential = new ClientSecretCredential(
//         azureTenantId,
//         azureClientId,
//         azureClientSecret,
//       );
//       const client = new CertificateClient(
//         process.env.AZURE_VAULT_URL ?? '',
//         credential,
//       );
//       const latestCertificate = await client.getCertificate(certificateName);
//       return latestCertificate.cer;
//     } else {
//       return new Buffer([]);
//     }
//   } catch (error) {
//     console.log('Error retrieving root CA:', error.message);
//     return new Buffer([]);
//   }
// }
