import { ApolloServer } from '@apollo/server';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {expressMiddleware} from '@apollo/server/express4';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config.js';
import './firebaseConfig.js';
import {getAuth} from 'firebase-admin/auth';
import { typeDefs } from './schemas/index.js';
import { resolvers } from './resolvers/index.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const app = express();
const httpServer = http.createServer(app);

//Connect to DB
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nivtbnf.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;

const schema = makeExecutableSchema({typeDefs, resolvers});

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
})
const serverCleanup = useServer({schema}, wsServer);

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({httpServer}),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    }
                }
            }
        }
    ] 
})

await server.start();

const authorizationJWT = async (req, res, next) => {
    console.log({authorization: req.headers.authorization});
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(" ")[1];
        getAuth().verifyIdToken(accessToken)
        .then(decodedToken => {
            console.log(decodedToken)
            res.locals.uid = decodedToken.uid;
            next();
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({message:'Forbidden', error: err});
        })
    }
    else {
        next();
        //return res.status(401).json({message:'Unauthorized'});
    }
}

app.use(cors(), authorizationJWT, bodyParser.json(), expressMiddleware(server, {
    context: async ({req, res}) => {
        return {uid: res.locals.uid};
    }
}));

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log("connected to DB")
    await new Promise(resolve => httpServer.listen({port: PORT}, resolve));
    console.log('Server ready at http://localhost:4000');
})

