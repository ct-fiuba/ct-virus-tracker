const amqp = require('amqp-connection-manager');

module.exports = function CodeHandler() {

  const queueAddress = process.env.QUEUE_ADDRESS;
  const queueName = process.env.QUEUE_NAME;

  const connection = amqp.connect([queueAddress]);

  const channel = connection.createChannel({
    json: true,
    setup: function(channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        // Note that `this` here is the channelWrapper instance.
        return channel.assertQueue(queueName, {durable: true});
    }
  });

  const sendCode = async (code) => {
    return channel.sendToQueue(queueName, code);
  }
     
  return {
    sendCode
  };
};
