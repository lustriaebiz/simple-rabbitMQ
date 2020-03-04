import ampq from 'amqplib'

interface iConsume {
    channel : any;
    queue   : string;
}

class Consumer {

    receive() {
        ampq.connect('amqp://localhost').then(conn => {

            /** create channel */
            return conn.createChannel().then(channel => {
                
                /** receive data 1 */
                let params1 : iConsume = {
                    channel : channel,
                    queue   : 'queue1'
                };

                this.consume(params1);
                /** end receive data 1 */

                /** receive data 2 */
                let params2 : iConsume = {
                    channel : channel,
                    queue   : 'queue2'
                };

                this.consume(params2);
                /** */

            })
            /** */

        }).catch(console.warn);
    }

    consume(params: iConsume) {
        
        let queue = params.channel.assertQueue(params.queue, { durable: false });

        if(queue) {
            // parse queue
            queue.then(() => {

                // get message from rabbitMQ
                return params.channel.consume(
                    params.queue, 
                    (message : any) => {
                        console.log('- Received', message?.content.toString())
                    }, 
                    { 
                        noAck: true 
                    }
                );
            })
            .then(() => {
                console.log('waiting for messages..');
            })
        }
    }

}

let consumer$ = new Consumer;
consumer$.receive();