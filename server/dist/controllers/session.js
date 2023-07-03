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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const associations_1 = require("../models/associations");
const utils_1 = require("../utils");
// Needs body with {"email", "password"} 
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400)
            .json((0, utils_1.resBody)(false, "400", null, "Missing input data"));
    }
    try {
        const user = yield associations_1.User.findOne({ where: { email: req.body.email } });
        if (!user)
            throw new Error('Incorrect email/password');
        // @ts-ignore
        const validatedPass = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validatedPass)
            throw new Error('Incorrect email/password');
        // @ts-ignore
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
        res.cookie('jwt', token, {
            httpOnly: false,
            secure: false,
            // secure: __prod__,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30d
        });
        res.status(200)
            // @ts-ignore
            .json((0, utils_1.resBody)(true, null, user.userId, 'Logged in successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(401)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('jwt', '', {
            httpOnly: false,
            expires: new Date(0)
        });
        res.status(200)
            .json((0, utils_1.resBody)(true, null, null, 'Logged out successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401)
            .json((0, utils_1.resBody)(false, "401", null, 'Token is not present'));
    }
    // @ts-ignore
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(403)
                .json((0, utils_1.resBody)(false, "403", null, 'Some error happenedd during the token verification 1'));
        }
        // @ts-ignore
        const user = yield associations_1.User.findByPk(payload.userId);
        if (!user) {
            return res.status(403)
                .json((0, utils_1.resBody)(false, "403", null, 'Some error happenedd during the token verification 2'));
        }
        const _a = Object.assign({}, user.dataValues), { password } = _a, safeUser = __rest(_a, ["password"]);
        // @ts-ignore
        req.user = safeUser;
        return next();
    }));
});
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200)
            // @ts-ignore
            .json((0, utils_1.resBody)(true, null, req.user, 'User is logged'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.log(err);
        res.status(500)
            .json((0, utils_1.resBody)(false, null, null, err.message));
    }
});
exports.default = { logIn, logOut, authorize, getUserInfo };
