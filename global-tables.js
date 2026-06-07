const AWS = require("aws-sdk");
AWS.config.update({ region: 'eu-north-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const newRegion = 'ap-northeast-3';
const docClient_2 = new AWS.DynamoDB.DocumentClient({region: newRegion});

docClient.put({
    TableName: 'global_td_notes',
    Item: {
        user_id: 'ABC',
        timestamp: 5,
        title: 'ABC title',
        content: 'ABC content'
    }
}, (err, data)=>{
    if(err) {
        console.log(err);
    } else {
        console.log(data);
        console.log('Put operation successful in', AWS.config.region);

        setTimeout(()=>{
            // AWS.config.update({ region: 'eu-central-1' });

            docClient_2.get({
                TableName: "global_td_notes",
                Key: {
                    user_id: 'ABC',
                    timestamp: 5
                }
            }, (err, data)=>{
                if(err) {
                    console.log(err);
                } else {
                    console.log('Getting the item from', newRegion);
                    console.log(data);
                }
            });
        }, 3000);
    }
});