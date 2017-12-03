function FetchRequest(uri, uriData, onItemsFetched) {
    //Variables
    this.offset = 0;
    this.totalItems = 0;
    //Functions
    this.fetchPart = function () {
        //Store 'this' in variable to avoid fuckups
        var self = this;
        SC.get(uri,
            //Merge offset and limit with uri data
            $.extend(
                uriData,
                {
                    offset: self.offset,
                    limit: itemsPerRequest
                }
            ))
        .then(
            (output) => { //Success callback
                console.log("recieved response from get()");
                console.log(self);

                //Retrieve the fetched items
                var fetchedItems = [];
                if (output.collection !== undefined) {
                    fetchedItems = output.collection;
                } else {
                    fetchedItems = output;
                }
                self.totalItems += fetchedItems.length;

                //Perform callback with fetched items
                onItemsFetched(fetchedItems);

                //If there are likely more items to fetch (and we're below our max)
                if (fetchedItems.length > 0 && self.offset < maxItems) {
                    //Try fetching more tracks
                    setStatus("Fetched with offset " + self.offset);
                    self.offset += itemsPerRequest;
                    self.fetchPart();
                } else {
                    //No tracks fetched or max tracks reached - this is most likely the endpoint
                    setStatus("Done fetching (" + self.totalItems + " items found)");
                }
            }
        ).catch(
            (reason) => { //Failure callback
                console.log("get() error!!")
                console.log(reason)
                setStatus("There was an error: " + reason);
            });
    }
    //Constructor
    setStatus("Fetching items from " + uri);
    this.fetchPart();
}