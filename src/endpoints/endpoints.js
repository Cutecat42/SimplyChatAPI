/**
 * Required External Modules and Interfaces
 */

const express = require("express");
const { getPublicMessage, getProtectedMessage, getUser } = require("./endpointFuncs");
const { checkJwt } = require("../authz/check-jwt");

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

module.exports = {
    endpointsRouter,
};
