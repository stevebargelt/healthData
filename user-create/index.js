// Reference to the uuid package which helps us to create 
// unique identifiers for our PartitionKey
const uuidv4 = require('uuid/v4');

module.exports = async function (context, req) {
    context.log('User Create Starting');

    if (req.body && (req.body.email, req.body.firstname && req.body.lastname && req.body.phone)) {
        const userId = uuidv4();
        context.bindings.outputTable = [];
        context.bindings.outputTable.push({
            PartitionKey: "user",
            RowKey: userId,
            Email: req.body.email,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Phone: req.body.phone
        });
        context.res = {
            status: 201, // 201 is CREATED 
            body: "User ID " + userId + " Email " + req.body.email
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass email, firstname, lastname, phone as JSON in the request body"
        };
    }
};