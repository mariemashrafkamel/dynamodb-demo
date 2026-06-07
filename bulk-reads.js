const AWS = require('aws-sdk');
const async = require('async');

AWS.config.update({ region: 'eu-north-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
var startKey = [];
var result = [];
var pages = 0;

async.doWhilst(
    //iteratee
    (callback)=>{
        let params = {
            TableName: 'global_td_notes',
            Limit: 3,
        };

        if(startKey.length > 0) {
            params.ExclusiveStartKey = startKey;
        }

        docClient.scan(params, (err, data)=>{
            if(err) {
                console.log(err);
                callback(null, {});
            } else {
                result = result.concat(data.Items);
                startKey = data.LastEvaluatedKey;
                pages++;
                console.log('Page', pages, 'retrieved successfully');
                callback(null, result);
            }
        });
    },
    //test
    ()=>{
        return startKey !== undefined;
    },
    //callback
    (err)=>{
        if(err) {
            console.log('Error occurred during scan:', err);
        } else {
            console.log('Scan completed successfully. Total items retrieved:', result.length);
        }
    }
)