 const AWS = require('aws-sdk');
 
 AWS.config.update({ region: 'eu-north-1' });
 
 const docClient = new AWS.DynamoDB.DocumentClient();
 const s3 = new AWS.S3()
 
 const faker = require('faker'); //to generate items with random data
 const moment = require('moment'); //to generate timestamps
 const zlib = require('zlib'); //to compress
 
 generateNotesItem((item) => {
    console.log("Original Item -> ", item)
    putNotesItemS3(item, (err,data) =>{
        if(err) console.log(err);
        //else console.log("dataa-> ", data)
        console.log("Stored item -> ", item)
        getNotesItemS3({
            user_id: item.user_id,
            timestamp: item.timestamp
        }, (err,data) => {
           if(err) console.log(err);
           else console.log("Retrieved read", data.Item);
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

function putNotesItemS3(item, callback) {
    if(item.content.length > 35) {
       var params = {
        Bucket: 'udemy-td-notes-content',
        Key: item.user_id + '|' + item.timestamp,
        Body: item.content
       }
       s3.upload(params, (err,data) => {
        if(err) callback(err)
        else{
            item.content_s3 = data.Location
            item.content = undefined;
            docClient.put({
                TableName: "global_td_notes",
                Item: item
            }, callback)
        }
       })
    }
    else{
        docClient.put({
                TableName: "global_td_notes",
                Item: item
            }, callback)
    }

}

function getNotesItemS3(key, callback){
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
                var params = {
                    Bucket: 'udemy-td-notes-content',
                    Key: key.user_id + '|' + key.timestamp
                }

                s3.getObject(params, (err,content_s3)=>{
                    if(err) callback(err)
                    else{
                        data.Item.content = content_s3.Body.toString()
                        data.Item.content_s3 = undefined;
                        callback(null, data)
                    }
                })
            }
        }
    })

}