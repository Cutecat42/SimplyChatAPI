/**
 * Required External Modules and Interfaces
 */

const express = require("express");
const { getPublicMessage, getProtectedMessage, getUser } = require("./endpointFuncs");
const { checkJwt } = require("../authz/check-jwt");
const serviceAccount = require('../firebase/firebase-key');
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

/**
 * Router Definition
 */

const endpointsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET messages/

endpointsRouter.get("/public-message", (req, res) => {
    const message = getPublicMessage();
    res.status(200).send(message);
});

endpointsRouter.get("/protected-message", checkJwt, (req, res) => {
    const message = getProtectedMessage();
    res.status(200).send(message);
});

endpointsRouter.get("/user", checkJwt, (req, res) => {
    const message = getUser(req.headers.authorization);
    res.status(200).send(message);
});

endpointsRouter.get('/firebase', checkJwt, async (req, res) => {
    const { sub: uid } = req.user;

    try {
        const firebaseToken = await firebaseAdmin.auth().createCustomToken(uid);
        res.json({ firebaseToken });
        console.log(firebaseToken);
    } catch (err) {
        res.status(500).send({
            message: 'Something went wrong acquiring a Firebase token.',
            error: err
        });
    }
});

module.exports = {
    endpointsRouter,
};
