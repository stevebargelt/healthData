const azure = require('azure-storage');
const tableService = azure.createTableService(process.env["AzureWebJobsStorage"]);
const tableName = "healthData";
const partitionKey = "weight";

module.exports = function (context, req) {
    context.log('Start Weight Read');
    tableService.defaultPayloadFormat = azure.TableUtilities.PayloadFormat.NO_METADATA;
    const weightId = req.params.id;
    const userId = req.query.userId;
    if (weightId) {
        var query = new azure.TableQuery()
            .where('PartitionKey eq ? and RowKey eq ?', partitionKey, weightId);
        tableService.queryEntities(tableName, query, null, function (error, result, response) {
            if(!error){
                context.res.status(200).json(response.body);
            } else {
                context.res.status(500).json({error : error});
            }
        });
    } else if (userId) {
        // return the top 100 items
        var query = new azure.TableQuery()
            .top(100)
            .where('PartitionKey eq ? and UserID eq ?', partitionKey, userId);
        tableService.queryEntities(tableName, query, null, function (error, result, response) {
            if(!error){
                context.res.status(200).json(response.body);
            } else {
                context.res.status(500).json({error : error});
            }
        });
    } else {
        context.res = {
            status: 400,
            body: "You must send a UserID or an Id (a weight RowKey / weightId)"
        };
        context.done();
    }    

};