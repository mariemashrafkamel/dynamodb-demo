 const AWS = require('aws-sdk');
 
 AWS.config.update({ region: 'eu-north-1' });
 
 const docClient = new AWS.DynamoDB.DocumentClient();
 
 const faker = require('faker'); //to generate items with random data
 const moment = require('moment'); //to generate timestamps
 


 function generateNotesItem(callback) {
    callback({
        user_id: faker.random.uuid(),
        note_id: faker.random.uuid(),
        timestamp: moment().unix(),
        cat: faker.random.word(),
        title: faker.random.words(),
        content: faker.hacker.phrase(),
        user_name: faker.internet.userName(),
        expires: moment().unix() + 3600, //expires in 1 hour
    })
}

function putNotesItem(item, callback) {

}

function getNotesItem(key, callback){
    
}