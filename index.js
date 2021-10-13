const { isString, isObjectLike, isNumber, reject } = require('lodash');
const { MongoClient } = require('mongodb');

/**
 * @name Mongo Key Values
 */
class MKV {

    /**
     * @class MKV
     * @param {string} username 
     * @param {string} password 
     * @param {string} database 
     * @returns {void} void
     */
    constructor(username, password, database, collection) {
        Object.assign(this, { username, password, database, collection });
        for (const [k, v] of Object.entries(this)) {
            if (v === undefined) { throw new Error(`${k} argument is undefined`); }
            if (!isString(v)) { throw new Error(`${k} argument must be string`); }
        }

        this.mongo_url = 'mongodb-europe-west1.ssdo5.mongodb.net';
        this.uri = `mongodb+srv://${this.username}:${this.password}@${this.mongo_url}/${this.database}?retryWrites=true&w=majority`;
    };

    /**
     * @description Reads a document from mongo
     * @param {Object} query Must be a valid JSON object
     * @param {Number} limit Must be a valid number - default 100
     * @returns {Promise} Resolve | Rejected
     */
    get(query = {}, limit = 100) {
        return new Promise((resolve, reject) => {
            if (!isObjectLike(query)) { return reject('Query arguement must be a json object'); }
            if (!isNumber(limit)) { return reject('Limit must be a number'); }
            let client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true, zlibCompressionLevel: 9 });
            client.connect(err => {
                if (err) { return reject(err); }
                let collection = client.db(this.database).collection(this.collection);
                collection.find(query, { limit: limit , readConcern: 'available' })
                    .toArray()
                    .then(data => { resolve(data); client.close(); })
                    .catch(err => { reject(err); client.close(); })
            });
        });
    };

    /**
     * @description Adds a new document to mongo
     * @param {Object} value Must be a valid JSON object
     * @returns {Promise} Resolve | Rejected
     */
    set(value) {
        return new Promise((resolve, reject) => {
            if (!isObjectLike(value)) { return reject('Value arguement must be a json object'); }
            let client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true, zlibCompressionLevel: 9 });
            client.connect(err => {
                if (err) { return reject(err); }
                let collection = client.db(this.database).collection(this.collection);
                collection.insertOne(value)
                    .then(created => { resolve(created); client.close(); })
                    .catch(err => { reject(err); client.close(); })
            })
        })
    }


    /**
     * @description This will delete a single document from the collection
     * @param {*} query 
     * @returns {Promise} Resolve | Rejected
     */
    delete(query){
        return new Promise((resolve, reject) => {
            if (!isObjectLike(query)) { return reject('Value arguement must be a json object'); }
            let client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true, zlibCompressionLevel: 9 });
            client.connect(err => {
                if (err) { return reject(err); }
                let collection = client.db(this.database).collection("Storage");
                collection.deleteOne(query)
                    .then(deleted => { resolve(deleted); })
                    .catch(err => { reject(err); })
            });
        })
    }


    /**
     * @description WARNING - this will delete ALL documents from the collection - use with CAUTION
     * @param {Boolean} sure 
     * @returns {Promise} Resolve | Rejected
     */
    purge(sure = false){
        return new Promise((resolve, reject) => {
            if(sure){
                let client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true, zlibCompressionLevel: 9 });
                client.connect(err => {
                    if (err) { return reject(err); }
                    let collection = client.db(this.database).collection("Storage");
                    collection.deleteMany()
                        .then(deleted => { resolve(deleted); })
                        .catch(err => { reject(err); })
                });
            }
        })
    }
}

module.exports = MKV;