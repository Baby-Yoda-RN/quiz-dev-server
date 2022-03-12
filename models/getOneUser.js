
export const getOneUser = async(documentClient, parameters) => {

    try {
        console.log("Getting a new item...");
        /* Reference: 
        https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.04.html
        scan: reads EVERY item in table and returns all data
        query: look up data in table according to some condition

        https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.01
        put: create new item
        get: read an item
        update: update an item
        delete: delete an item
        */
        documentClient.get(parameters, (error, data) => {
            if (error) {
                console.error("Unable to get item. Error JSON:", JSON.stringify(error, null, 2));
            } else {
                console.log("Get item:", JSON.stringify(data, null, 2));
            }
        });
    } catch (error) {
        console.log(error);
    }

}


