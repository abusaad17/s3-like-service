// import axios from 'axios';
// import { CreateEdgeDto } from '../dto/register.dto';

// export const createAuthToken = async (
//   edgeId: string,
//   hardwareId: string,
// ): Promise<any> => {
//   // Data to be sent in the request body
//   const requestData = {
//     description: `Auth token for gateway ${hardwareId}`,
//     acl: [`bind:edge=${edgeId}`],
//   };

//   // Request configuration
//   const config = {
//     headers: {
//       Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//       'Content-Type': 'application/json',
//       'Ngrok-Version': '2',
//     },
//   };
//   try {
//     const response = await axios.post(
//       `${process.env.NGROK_BASE_URL}/credentials`,
//       requestData,
//       config,
//     );
//     console.log('Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating edge:', error);
//     throw error;
//   }
// };

// export async function generatePrivateKeyAndCertificate(): Promise<any> {
//   try {
//     const forge = await import('node-forge');

//     const pki = forge.pki;

//     // generate a keypair or use one you have already
//     const keys = pki.rsa.generateKeyPair(2048);

//     // create a new certificate
//     const cert = pki.createCertificate();

//     // fill the required fields
//     cert.publicKey = keys.publicKey;
//     cert.serialNumber = '01';
//     cert.validity.notBefore = new Date();
//     cert.validity.notAfter = new Date();
//     cert.validity.notAfter.setFullYear(
//       cert.validity.notBefore.getFullYear() + 1,
//     );

//     // use your own attributes here, or supply a csr (check the docs)
//     const attrs = [
//       {
//         name: 'commonName',
//         value: 'example.org',
//       },
//       {
//         name: 'countryName',
//         value: 'US',
//       },
//       {
//         shortName: 'ST',
//         value: 'Virginia',
//       },
//       {
//         name: 'localityName',
//         value: 'Blacksburg',
//       },
//       {
//         name: 'organizationName',
//         value: 'Test',
//       },
//       {
//         shortName: 'OU',
//         value: 'Test',
//       },
//     ];

//     // here we set subject and issuer as the same one
//     cert.setSubject(attrs);
//     cert.setIssuer(attrs);

//     // the actual certificate signing
//     cert.sign(keys.privateKey);

//     // Convert the private key to PEM format
//     const privateKeyPem = pki.privateKeyToPem(keys.privateKey);
//     // now convert the Forge certificate to PEM format
//     const certificatePem = pki.certificateToPem(cert);
//     console.log(privateKeyPem);
//     console.log(certificatePem);
//     return { privateKey: privateKeyPem, cert: certificatePem };
//   } catch (error) {
//     console.log(error);
//   }
// }

// export const createCertificate = async (
//   privateKey: string,
//   certificate: string,
// ): Promise<any> => {
//   const requestData = {
//     certificate_pem: certificate,
//     private_key_pem: privateKey,
//   };

//   const config = {
//     headers: {
//       Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//       'Content-Type': 'application/json',
//       'Ngrok-Version': '2',
//     },
//   };
//   try {
//     const response = await axios.post(
//       `${process.env.NGROK_BASE_URL}/tls_certificates`,
//       requestData,
//       config,
//     );
//     console.log('Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating edge:', error);
//     throw error;
//   }
// };

// export const createDomain = async (
//   domain: string,
//   certificateId: string,
// ): Promise<any> => {
//   const requestData = {
//     certificate_id: certificateId,
//     domain: domain,
//     region: 'us',
//   };

//   const config = {
//     headers: {
//       Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//       'Content-Type': 'application/json',
//       'Ngrok-Version': '2',
//     },
//   };
//   try {
//     const response = await axios.post(
//       `${process.env.NGROK_BASE_URL}/reserved_domains`,
//       requestData,
//       config,
//     );
//     console.log('Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating edge:', error);
//     throw error;
//   }
// };

// export const createEdge = async (
//   createEdgeDto: CreateEdgeDto,
//   domain: string,
// ): Promise<any> => {
//   const data = {
//     description: 'acme https edge',
//     hostports: [`${domain}:443`],
//     metadata: createEdgeDto.tags.toString(),
//   };
//   const headers = {
//     Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//     'Content-Type': 'application/json',
//     'Ngrok-Version': '2',
//   };
//   try {
//     const response = await axios.post(
//       `${process.env.NGROK_BASE_URL}/edges/https`,
//       data,
//       { headers },
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error creating edge:', error);
//     throw error;
//   }
// };

// export const createHttpBackend = async () => {
//   const postData = {
//     body: '',
//     description: 'description',
//     headers: {
//       'Content-Type': 'text/plain',
//     },
//     metadata: '{"environment": "staging"}',
//     status_code: 418,
//   };

//   const headers = {
//     Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//     'Content-Type': 'application/json',
//     'Ngrok-Version': '2',
//   };

//   const response = await axios.post(
//     `${process.env.NGROK_BASE_URL}/backends/http_response`,
//     postData,
//     {
//       headers: headers,
//     },
//   );

//   return response.data;
// };

// export const createTunnelGroupBackend = async (edgeId: string) => {
//   const requestData = {
//     description: 'description',
//     labels: { edge: edgeId },
//     metadata: '{"environment": "staging"}',
//   };

//   const headers = {
//     Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//     'Content-Type': 'application/json',
//     'Ngrok-Version': '2',
//   };

//   try {
//     const response = await axios.post(
//       `${process.env.NGROK_BASE_URL}/backends/tunnel_group`,
//       requestData,
//       { headers },
//     );
//     return response.data;
//   } catch (error) {
//     return 'Internal Server Error';
//   }
// };

// export const createFailoverBackend = async (edgeId: string) => {
//   const httpBackendDetails = await createHttpBackend();
//   const tunnelBackendDetails = await createTunnelGroupBackend(edgeId);
//   const requestData = {
//     backends: [tunnelBackendDetails.id, httpBackendDetails.id],
//     description: 'failoverBackendDescription',
//     metadata: '{"environment": "staging"}',
//   };

//   const headers = {
//     Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//     'Content-Type': 'application/json',
//     'Ngrok-Version': '2',
//   };

//   try {
//     const response = await axios.post(
//       `${process.env.NGROK_BASE_URL}/backends/failover`,
//       requestData,
//       { headers },
//     );
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

// export const createEdgeRoute = async (
//   path: string,
//   backendId: string,
//   edgeId: string,
// ) => {
//   try {
//     const postData = {
//       description: 'description',
//       match: path || '/',
//       match_type: 'path_prefix',
//       metadata: '{"environment": "staging"}',
//       backend: {
//         backend_id: backendId,
//       },
//     };

//     const headers = {
//       Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//       'Content-Type': 'application/json',
//       'Ngrok-Version': '2',
//     };
//     const response = await axios.post(
//       `${process.env.NGROK_BASE_URL}/edges/https/${edgeId}/routes`,
//       postData,
//       { headers },
//     );

//     return response.data;
//   } catch (error) {}
// };

// export const connectOauth = async (
//   edgeId: string,
//   routeId: string,
//   emailIds: string[],
// ) => {
//   try {
//     const postData = {
//       enabled: true,
//       provider: {
//         microsoft: {
//           client_id: process.env.MICROSOFT_CLIENT_ID,
//           client_secret: process.env.MICROSOFT_CLIENT_SECRET,
//           email_addresses: emailIds,
//           // email_domains: ['etherealcovenant.com', 'gmail.com'],
//           scopes: ['openid', 'profile', 'User.Read', 'email'],
//         },
//       },
//     };

//     const response = await axios.put(
//       `${process.env.NGROK_BASE_URL}/edges/https/${edgeId}/routes/${routeId}/oauth`,
//       postData,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//           'Content-Type': 'application/json',
//           'Ngrok-Version': '2',
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// export async function getTLSCertificate() {
//   try {
//     const response = await axios.get(
//       `${process.env.NGROK_BASE_URL}/tls_certificates`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NGROK_API_KEY}`,
//           'Ngrok-Version': '2',
//         },
//       },
//     );

//     // Filter the response to get only the certificates with specific criteria
//     const filteredCertificates = response.data.tls_certificates.filter(
//       (cert) => {
//         // Add your filtering criteria here
//         // For example, filter certificates that contain "dev.inveron.com" in the description
//         return cert.subject_common_name === 'inveron.com';
//       },
//     );

//     return filteredCertificates;
//   } catch (error) {
//     console.error('Error fetching TLS certificates:', error);
//     throw error;
//   }
// }
