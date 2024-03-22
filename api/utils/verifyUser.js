// import jwt from "jsonwebtoken";
// import { errorHandler } from "./error.js";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token || req.headers["Authorization"];

//   if (!token) {
//     return res.status(403).json({ message: "Token not provided" });
//   }

//   jwt.verify(
//     token.replace("Bearer ", ""),
//     process.env.JWT_SECRET,
//     (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: "Invalid token" });
//       }

//       req.user = decoded;
//       next();
//     }
//   );
// };

import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
  const token = req.headers["Authorization"] || req.cookies.access_token;
  console.log(token);
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

// import jwt from "jsonwebtoken";

// export const verifyToken = async (req, res, next) => {
//   try {
//     let token = req.header("Authorization");

//     if (!token) {
//       return res.status(403).send("Access Denied");
//     }

//     if (token.startsWith("Bearer ")) {
//       token = token.slice(7, token.length).trimLeft();
//     }

//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
