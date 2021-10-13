# MongoKV

## What is MKV

MongoKV is a abstracted layer designed to make my DB calls a little easier, i am pushing it on GitHub incase it helps anyone else. 
___

## Constructor

The constructor is needed to setup a basic connection with the database, i personally recommend that you set up a very tight scope on access and have a new class per collection. 


#### Example
```
const KVP = new MKV(username, password, database, collection);
```

___
## Get method


MKV's .get() uses MongoDB's .find() method to search for a query in the collection and return it as a promise. An example such as will return the record of any 'username' key with the value of 'testuser'

#### Example
```
KVP.get({"username": "testuser"})
    .then(console.log)
    .catch(console.log)
```

You can also do the same request in a async/await format, although you will need to surround it in a try/catch to ensure a rejection is handled. 

#### Example
```
((async()=>{
    try {
        let data = await KVP.get({"username": "testuser"})
    } catch(error){
        console.log(error)
    }
}))()
```
___
## Set method

MKV's .set() method uses MongoDB's .insertOne() method to add a document to a chosen collection, by default it requires a write concern of 'majority' which means that most of the nodes confirm they have added it before its considered added by the code.

#### Example
```
KVP.set({"username":"testuser2"})
    .then(console.log)
    .catch(console.log)
```

And for the async/await scenario. 

#### Example
```
((async()=>{
    try {
        let data = await KVP.set({"username": "testuser2"})
    } catch(error){
        console.log(error)
    }
}))()
```

Will be adding the other methods in a next commit