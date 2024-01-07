import ejs from 'ejs';

export const renderEjsToHTMLStr = async (template, data = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const compiledEjs = ejs.compile(template);
      const emailHtml = compiledEjs(data);
      resolve(emailHtml);
    } catch (err) {
      reject(err);
    }
  });
};
