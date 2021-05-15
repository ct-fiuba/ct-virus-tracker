const amqp = require('amqp-connection-manager');

module.exports = function CodeHandler() {

  const connection = amqp.connect([process.env.CODES_QUEUE]);

  const channel = connection.createChannel({
    json: true,
    setup: function(channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        // Note that `this` here is the channelWrapper instance.
        return channel.assertQueue('codes', {durable: true});
    }
  });

  const sendCode = async (code) => {
    return channel.sendToQueue('codes', code);
  }
     
  return {
    sendCode
  };
};
