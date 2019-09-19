// Reference to the uuid package which helps us to create 
// unique identifiers for our PartitionKey
const uuidv4 = require('uuid/v4');

module.exports = async function (context, req) {
    context.log('Weight Create Started');

    if (req.body && (req.body.userId, req.body.date && req.body.weight && req.body.bf)) {
        var measuredAt = req.body.date;
        measuredAt = measuredAt.replace('at ', '');
        measuredAt = measuredAt.replace('AM', ' AM');
        measuredAt = measuredAt.replace('PM', ' PM');
        let measuredAtDate = new Date(measuredAt);
        let year = measuredAtDate.getFullYear();
        const userId = req.body.userId;
        const partitionKey = year + "_" + userId
        const rowKey = uuidv4();
        context.bindings.outputTable = [];
        context.bindings.outputTable.push({
            PartitionKey: partitionKey,
            RowKey: rowKey,
            UserID: userId,
            Date: measuredAtDate,
            Weight: req.body.weight,
            BF: req.body.bf
        });
        context.res = {
            status: 201, // 201 is CREATED 
            body: "Key " + rowKey + "User ID " + userId + " Date " + measuredAtDate + " Weight " + req.body.weight + " BF % " + req.body.bf
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a date, weight, and body fat % as JSON in the request body"
        };
    }
};