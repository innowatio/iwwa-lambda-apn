import {MongoClient} from "mongodb";
import {promisify} from "bluebird";

var connect = function (url) {
    return promisify(MongoClient.connect, MongoClient)(url);
};

export function findOne ({collectionName, query, url}) {
    return connect(url)
        .then(db => {
            var collection = db.collection(collectionName);
            return promisify(collection.findOne, collection)(query);
        });
}
