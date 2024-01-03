import { createCA, createCert } from 'mkcert';

const ca = await createCA({
  organization: 'Haiderzcompany',
});
const cert = await createCA();
