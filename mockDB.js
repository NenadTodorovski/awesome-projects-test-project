const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const { v4 } = require('uuid');

let db = null;

const firstProjectId = v4();
const secondProjectId = v4();

async function initDB() {
    // async/await syntax cleaner than .then() when handling promises IN THIS SCENARIO
    const inMemServer = new MongoMemoryServer();
    const serverURL = await inMemServer.getUri();
    const client = await MongoClient.connect(
        serverURL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );

    // Create mock db instance once server is started
    if (!db) {
        db = client.db();
        // Create collections and seed some initial data
        await db.collection('projects')
            .insertMany([
                {
                    projectId: firstProjectId,
                    name: 'First project',
                    description: 'Description for the first seeeded project.',
                    timesList: []
                },
                {
                    projectId: secondProjectId,
                    name: 'SECOND project with caps in the name',
                    description: 'Description for the SECOND seeeded project. Using random text in ordet to make the description longer. I will stop now. Feel free to remove it from the in-mem mock db',
                    timesList: []
                },
            ]);

        await db.collection("times").insertMany([
            {
                timeId: v4(),
                description: 'first task/time',
                amount: 1,
                projectRefId: firstProjectId,
            },
            {
                timeId: v4(),
                description: 'second task/time',
                amount: 2,
                projectRefId: firstProjectId,
            },
            {
                timeId: v4(),
                description: 'third task/time',
                amount: 3,
                projectRefId: secondProjectId,
            },
        ]);
    }

    return db;
}

// Create and export context using the created db
const context = async function () {
    const db = await initDB();
    return { db };
}();

module.exports = context;
