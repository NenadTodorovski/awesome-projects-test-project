const {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema
} = require('graphql');
const { v4 } = require('uuid');

const context = require('./mockDB');

//  TYPES/MODELS
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    description: 'Project model',
    fields: () => ({
        projectId: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        timesList: {
            type: new GraphQLList(TimeType),
            resolve: async (parent, args) => {
                const { db } = await context;

                // const resultPromise = await db.collection('times')
                //     .find({ projectRefId: parent.projectId }).toArray();

                return await db.collection('times')
                    .find({ projectRefId: parent.projectId }).toArray();
            }
        }
    })
})
const TimeType = new GraphQLObjectType({
    name: 'ProjectTime',
    description: 'A model for a task in a project with time in hours',
    fields: () => ({
        timeId: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        amount: { type: GraphQLNonNull(GraphQLInt) },
        projectRefId: { type: GraphQLNonNull(GraphQLString) },
        project: {
            type: ProjectType,
            resolve: async (parent, _) => {
                const { db } = await context;

                // const result = await db.collection('projects').findOne({ projectId: parent.projectRefId });

                return await db.collection('projects')
                    .findOne({ projectId: parent.projectRefId });
            }
        }
    })
})

const Queries = new GraphQLObjectType({
    name: 'Queries',
    description: 'Read data from mock db',
    fields: () => ({
        project: {
            type: ProjectType,
            description: 'Get a single project by id',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (_, args) => {
                const { db } = await context;
                const result = await db.collection('projects')
                    .findOne({ projectId: args.id });

                return await result;
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            description: 'Get a list of all projects',
            resolve: async () => {
                const { db } = await context;
                return db
                    .collection('projects')
                    .find()
                    .toArray();
            }
        },
        time: {
            type: TimeType,
            description: 'Get a single time by id',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (_, args) => {
                const { db } = await context;
                return db
                    .collection('projects')
                    .findOne({ timeId: args.id })
            }
        },
        times: {
            type: new GraphQLList(TimeType),
            description: 'Get a list of all times',
            resolve: async () => {
                const { db } = await context;
                return db
                    .collection('times')
                    .find()
                    .toArray();
            }
        },
    })
})
const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    description: 'Manipulate "persistance" layer - create, update, delete',
    fields: () => ({
        addProject: {
            type: ProjectType,
            description: 'Create a new project',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_, args) => {
                const { db } = await context;

                const newProject = {
                    projectId: v4(),
                    name: args.name,
                    description: args.description,
                    timesList: []
                };

                const resultPromise = await db.collection('projects').insertOne(newProject);

                // Return the added project
                return await resultPromise.ops[0];
            }
        },
        updateProject: {
            type: ProjectType,
            description: 'Update an existing project',
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
            },
            resolve: async (_, args) => {
                const { db } = await context;

                const resultPromise = await db.collection('projects')
                    .findOneAndUpdate(
                        { projectId: args.id },
                        { $set: { name: args.name, description: args.description } },
                        {
                            returnOriginal: false
                        },
                    );

                // Return the updated object
                return await resultPromise.value;
            }
        },
        deleteProject: {
            type: ProjectType,
            description: 'Delete a specific object',
            args: {
                id: { type: GraphQLString },
            },
            resolve: async (_, args) => {
                const { db } = await context;

                let resultPromise = await db.collection('projects')
                    .findOneAndDelete(
                        { projectId: args.id },
                    );

                // Return the deleted object
                return await resultPromise.value;
            }
        },
        addTime: {
            type: TimeType,
            description: 'Add time/task/whatevs TO A SPECIFIC PROJECT',
            args: {
                projectRefId: { type: GraphQLString },
                description: { type: GraphQLString },
                amount: { type: GraphQLInt }
            },
            resolve: async (_, args) => {
                const { db } = await context;

                const newTime = {
                    timeId: v4(),
                    description: args.description,
                    amount: args.amount,
                    projectRefId: args.projectRefId
                };

                const resultPromise = await db.collection('times')
                    .insertOne(newTime);

                // Return the added time
                return await resultPromise.ops[0];
            }
        },
        deleteTime: {
            type: TimeType,
            description: 'Delete time/task/whatevs',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (_, args) => {
                const { db } = await context;

                let resultPromise = await db.collection('times')
                    .findOneAndDelete({ timeId: args.id });

                // Return the deleted time
                return await resultPromise.value;
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: Queries,
    mutation: Mutations
});
