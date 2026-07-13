const { MongoClient } = require('mongodb');

const uri = 'mongodb://pranavmaheshwari:q9w6cy%2AGLA@ac-p11tv7c-shard-00-00.6cn05w1.mongodb.net:27017,ac-p11tv7c-shard-00-01.6cn05w1.mongodb.net:27017,ac-p11tv7c-shard-00-02.6cn05w1.mongodb.net:27017/?ssl=true&replicaSet=atlas-l2ozcs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Civic-AI';

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
