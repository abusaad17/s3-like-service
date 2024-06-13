// import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { getRootCA } from '../utils/azure-keyVault';
// import { X509Certificate } from 'node:crypto';

// @Injectable()
// export class VerifyClientCertMiddleware implements NestMiddleware {
//   async use(req: Request, res: Response, next: NextFunction) {
//     const clientCert: any = req.headers['x-arr-clientcert'] ?? '';
//     if (!clientCert) {
//       return res.status(HttpStatus.UNAUTHORIZED).json({
//         error: 'Unauthorized',
//         message: 'Client certificate not provided',
//       });
//     }

//     try {
//       const verificationResult = await this.verifyRootCertificate(clientCert);

//       if (!verificationResult.status) {
//         const statusCode =
//           verificationResult.reason === 'expired'
//             ? HttpStatus.FORBIDDEN
//             : HttpStatus.UNAUTHORIZED;
//         return res.status(statusCode).json({
//           error:
//             statusCode === HttpStatus.FORBIDDEN
//               ? 'Forbidden: Expired Certificate'
//               : 'Unauthorized',
//           message:
//             statusCode === HttpStatus.FORBIDDEN
//               ? 'Your device certificate has expired'
//               : 'You do not have the permission to enable the remote access',
//         });
//       }
//       req.headers['hardwareIdFromCert'] = verificationResult.hardwareId;
//       next();
//     } catch (error) {
//       console.error('Error reading or verifying certificates:', error);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         error: 'Something went wrong',
//         message: 'Something went wrong, please try again',
//       });
//     }
//   }

//   async verifyRootCertificate(clientCert: string): Promise<any> {
//     const rootCert = await getRootCA();
//     const rootCertificate = new X509Certificate(rootCert);
//     const binaryData = Buffer.from(clientCert, 'base64');
//     const clientCertificate = new X509Certificate(binaryData);

//     try {
//       if (
//         clientCertificate.issuer
//           .toString()
//           .split(',')[0]
//           .split('\n')
//           .filter((x) => x.split('=')[0] === 'CN')[0]
//           .split('=')[1] !==
//         rootCertificate.subject
//           .toString()
//           .split(',')[0]
//           .split('\n')
//           .filter((x) => x.split('=')[0] === 'CN')[0]
//           .split('=')[1]
//       ) {
//         console.error(
//           'Client certificate not signed by provided root SSL certificate.',
//         );
//         return { status: false, reason: 'unauthorized', hardwareId: null };
//       }

//       const currentDate = new Date();
//       const certificateExpiryDate = new Date(clientCertificate.validTo);

//       if (currentDate > certificateExpiryDate) {
//         console.error('Client certificate expired.');
//         return { status: false, reason: 'expired', hardwareId: null };
//       }

//       const hardwareId = clientCertificate.subject
//         .toString()
//         .split(',')[0]
//         .split('\n')
//         .filter((x) => x.split('=')[0] === 'CN')[0]
//         .split('=')[1];
//       return { status: true, hardwareId };
//     } catch (error) {
//       console.error('Error verifying client certificate:', error);
//       return { status: false, reason: 'unknown', hardwareId: null };
//     }
//   }
// }
