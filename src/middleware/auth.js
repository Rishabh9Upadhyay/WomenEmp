const jwt = require("jsonwebtoken");
const women = require("../models/registers");
const express = require("express");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            throw new Error("Authentication token missing");
        } 
        const varifyuser = jwt.verify(token, process.env.SECRET_KEY);  
        console.log(varifyuser);
        console.log(varifyuser._id);
        const user = await women.findOne({ _id: varifyuser._id });
        if (!user) {
            throw new Error("User not found");
        }
        console.log(user);
        console.log(user.Name);
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        console.error("Error in authentication:", e);
        res.render("signin",{
            request1: true
        });
    }
};

module.exports = auth;
