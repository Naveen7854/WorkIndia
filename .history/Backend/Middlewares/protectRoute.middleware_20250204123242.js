import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import pg from "pg";


const db = new pg.Client({
    database : "Workindia",
    password : "Raj@143225",
    host : "localhost",
    port : 5432,
    user : "postgres"
});

const JWT_SECRET = process.env.JWT_SECRET;

db.connect();

export async function protectRoute(req,res,next){
    try {
        // console.log(req.body);
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decode = jwt.verify(token,JWT_SECRET);

        if(!decode){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        console.log(decode);
        // console.log("Inside protectRoute");
        const result = await db.query("SELECT * FROM users WHERE id = $1",[decode.userId]);
        const user = result.rows;
        if(user.length === 0){
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user[0];
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error in protectRoute" });
    }
    
}

export async function adminProtectRoute(req,res,next){
    const api_key = req.query.api_key;
    // console.log(api_key);
    try {
        // console.log(req.body);
        const token = req.cookies.jwt;
        console.log(token);

        if(!token){
            return res.status(401).json({ message: "Unauthorized - No token Provided" });
        }

        if(!api_key){
            return res.status(401).json({ message: "Unauthorized - No api_key Provided" });
        }

        const decode = jwt.verify(token,JWT_SECRET);

        if(!decode){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        console.log(decode);
        // console.log("Inside protectRoute");
        // console.log(decode);
        const result = await db.query("SELECT * FROM admins WHERE id = $1 and api_key = $2",[decode.userId,api_key]);
        const user = result.rows;
        if(user.length === 0){
            return res.status(404).json({ message: "Invalid API_KEY" });
        }
        req.user = user[0];
        next();
    } catch (error) {
        console.log("Error in admin protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error in protectRoute" });
    }
}
// extra function
export function verifyToken(req, res, next) {
    // Get token from the 'Authorization' header (format: "Bearer <token>")
    const token = req.headers['authorization']?.split(' ')[1]; // Split to get the token after "Bearer"

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token using your JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // Attach the decoded user information to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
}

// // middlewares/apiKeyMiddleware.js
// import { db } from '../db';

export async function verifyAdminApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(403).json({ message: 'API Key is required' });
    }

    try {
        const result = await db.query("SELECT * FROM admins WHERE api_key = $1", [apiKey]);

        if (result.rows.length === 0) {
            return res.status(403).json({ message: 'Invalid API Key' });
        }

        req.admin = result.rows[0]; // Attach the admin data to the request
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Error verifying API key:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
