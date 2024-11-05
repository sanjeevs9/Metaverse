"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer")) {
            res.status(403).json({
                message: "user not found"
            });
            return;
        }
        token = token.split(" ")[1];
        const secretKey = process.env.SECRETKEY;
        if (!secretKey) {
            throw new Error("secret key not found");
        }
        const decode = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decode) {
            res.status(403).json({
                message: "user not found"
            });
            return;
        }
        res.locals.userid = decode.userId;
        next();
    });
}
