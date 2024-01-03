import fs from 'fs';
import { generateCA, generateCert } from '../services/cert.service.js';

const ca = await generateCA();
const cert = await generateCert({}, ca);
// console.log(ca.key, ca.cert); // certificate info
// console.log(`${cert.cert}${ca.cert}`);

fs.writeFileSync('configs/ca.key', ca.key);
fs.writeFileSync('configs/ca.crt', ca.cert);
fs.writeFileSync('configs/cert.key', cert.key);
fs.writeFileSync('configs/cert.crt', cert.cert);
