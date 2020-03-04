import ampq from 'amqplib'


interface iSendToQueue {
    channel : any;
    data    : any;
    queue   : string;
}

class Producer {

    sent() {
        ampq.connect('amqp://localhost').then(conn => {

            /** create channel */
            return conn.createChannel().then(channel => {
                
                /** send data 1 */
                let data1 = 'hai broo..';
                let params1 : iSendToQueue = {
                    channel : channel,
                    data    : JSON.stringify(data1),
                    queue   : 'queue1'
                };

                this.sendToQueue(params1);
                /** end send data 1 */


                /** send data 2 */
                
                let data2 = {
                    success : true,
                    data    : [
                        { name: 'batman', price: '$18' },
                        { name: 'deadpool', price: '$12' }
                    ],
                    message : 'success get data'
                };

                let params2 : iSendToQueue = {
                    channel : channel,
                    data    : JSON.stringify(data2),
                    queue   : 'queue2'
                };

                this.sendToQueue(params2);
                /** end send data 2 */

            })
            .finally(() => {
                // close connection 
                setTimeout(function() { conn.close(); }, 500);
            })
            /** */

        }).catch(console.warn);
    }

    sendToQueue(params: iSendToQueue) {
        params.channel.assertQueue(params.queue, { durable: false });

        console.log( 'Sent - ', params.data);

        // sent message
        params.channel.sendToQueue(params.queue, Buffer.from(params.data));
    }
}


let producer$ = new Producer;
producer$.sent();