module.exports = function CodeHandler(rabbitManager) {
  const sendCode = async (code) => {
    return rabbitManager.channel.sendToQueue(rabbitManager.queueName, code);
  }

  return {
    sendCode
  };
};
