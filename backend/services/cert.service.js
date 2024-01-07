import * as mkcert from 'mkcert';

export const generateCA = async (options) => {
  const defaultOptions = {
    organization: 'Haiderz Company',
    countryCode: 'PK',
    state: 'Punjab',
    locality: 'Islamabad',
    validity: 365,
  };
  return await mkcert.createCA({ ...defaultOptions, ...options });
};
export const generateCert = async (options, ca) => {
  const defaultOptions = {
    ca: { key: ca.key, cert: ca.cert },
    domains: ['localhost'],
    validity: 365,
    email: 'inventer@gmail.com',
    organization: 'inventer lord',
  };
  return await mkcert.createCert({ ...defaultOptions, ...options });
};

// const ca = await createCA({
//   organization: 'Hello CA',
//   countryCode: 'NP',
//   state: 'Bagmati',
//   locality: 'Kathmandu',
//   validity: 365,
// });

// const cert = await createCert({
//   ca: { key: ca.key, cert: ca.cert },
//   domains: ['127.0.0.1', 'localhost'],
//   validity: 365,
// });
