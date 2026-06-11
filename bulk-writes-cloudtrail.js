const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-north-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

const faker = require('faker'); //to generate items with random data
const moment = require('moment'); //to generate timestamps

setInterval(() => {
    let params = {
        TableName: 'encrypted-table',
    };

    generateNotesItem((item)=>{
        params.Item = item;

        docClient.put(params, (err, data)=>{
            if(err) {
                console.log(err);
            } else {
                console.log('Item added successfully');
            }
        });
    })
}, 300);

function generateNotesItem(callback) {
    callback({
        user_id: faker.random.uuid(),
        timestamp: moment().unix(),
    })
}