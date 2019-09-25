const PORT = process.env.PORT;
const HOST = process.env.HOST;

const getDomain = () => `${HOST}:${PORT}`;


module.exports = getDomain