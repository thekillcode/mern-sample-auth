import path from 'path';
import { URL } from 'url';

export const dirname = (str, meta) => {
  return new URL(str, meta).pathname;
};
