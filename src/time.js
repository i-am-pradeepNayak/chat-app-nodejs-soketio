const generateMessage = (text,username) => {
  return {
    username:username,
    text: text,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
};

const generateLocationMessage = (url,username) => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
