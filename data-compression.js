 const AWS = require('aws-sdk');
 
 AWS.config.update({ region: 'eu-north-1' });
 
 const docClient = new AWS.DynamoDB.DocumentClient();
 
 const faker = require('faker'); //to generate items with random data
 const moment = require('moment'); //to generate timestamps
 const zlib = require('zlib'); //to compress
 
 generateNotesItem((item) => {
    console.log("uncompressed item -> ", item)
    putNotesItem(item, (err,data) =>{
        if(err) console.log(err);
        //else console.log("dataa-> ", data)
        console.log("Compressed item -> ", item)
        getNotesItem({
            user_id: item.user_id,
            timestamp: item.timestamp
        }, (err,data) => {
           if(err) console.log(err);
           else console.log("uncompressed read", data.Item);
        })
    })
 })


 function generateNotesItem(callback) {
    callback({
        user_id: faker.random.uuid(),
        note_id: faker.random.uuid(),
        timestamp: moment().unix(),
        cat: faker.random.word(),
        title: faker.random.words(),
        content: faker.hacker.phrase(),
        user_name: faker.internet.userName(),
        expires: moment().unix() + 3600, //expires in 1 hour,
    })
}

function putNotesItem(item, callback) {
    if(item.content.length > 35) {
        zlib.gzip(item.content, (e,content_b)=>{
            item.content_b = content_b
            item.content = undefined
            docClient.put({
                TableName: "global_td_notes",
                Item: item
            }, callback)
        })

    }
    else{
        docClient.put({
                TableName: "global_td_notes",
                Item: item
            }, callback)
    }

}

function getNotesItem(key, callback){
    docClient.get({
        TableName: "global_td_notes",
        Key: key
    }, (err,data) => {
        if(err) {
            callback(err)
        }
        else {
            if(data.Item.content){
                callback(null,data)
            }
            else{
                zlib.gunzip(data.Item.content_b, (err, content) =>{
                    if(err) {
                        callback(err)
                    }
                    else{
                        data.Item.content = content.toString();
                        data.Item.content_b = undefined;
                        callback(null, data);
                    }
                })
            }
        }
    })

}