import fs from 'fs';
import { generateCA, generateCert } from '../services/cert.service.js';

const ca = await generateCA({
  organization: 'Haiderz Company',
  countryCode: 'PK',
  state: 'Punjab',
  locality: 'Islamabad',
  validity: 365,
});
const cert = await generateCert(
  {
    domains: ['localhost', '127.0.0.1', '::1'],
    validity: 365,
    email: 'inventer@gmail.com',
    organization: 'inventer lord',
  },
  ca
);
// console.log(ca.key, ca.cert); // certificate info
// console.log(`${cert.cert}${ca.cert}`);

fs.writeFileSync('configs/ca.key', ca.key);
fs.writeFileSync('configs/ca.crt', ca.cert);
fs.writeFileSync('configs/cert.key', cert.key);
fs.writeFileSync('configs/cert.crt', cert.cert);
