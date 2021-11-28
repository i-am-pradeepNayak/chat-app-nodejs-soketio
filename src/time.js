const generateMessage = (text) => {
  return {
    text: text,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
};

const generateLocationMessage = (url) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
