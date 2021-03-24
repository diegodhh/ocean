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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express_1 = __importDefault(require("express"));
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var passport_1 = __importDefault(require("./passport"));
var app = express_1.default();
function main(app) {
    return __awaiter(this, void 0, void 0, function () {
        var conn, err_1, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, typeorm_1.createConnection()];
                case 1:
                    conn = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 3];
                case 3:
                    log = function () {
                        return function (_req, res, next) {
                            next();
                        };
                    };
                    // app.use(cors);
                    app.use(passport_1.default.initialize());
                    app.get("/", function (_req, res) {
                        res.send("Hello World!!!");
                    });
                    app.get("/myapp", function (_req, res) {
                        res.redirect(301, "msrm42app://msrm42app.io/");
                    });
                    app.get("/auth/google/success", function (_req, res) {
                        return res.redirect("msrm42app://msrm42app.io?id=" + 123456);
                    });
                    app.get("/auth/google/failure", function (_req, res) { return res.send("error"); });
                    app.get("/auth/google", passport_1.default.authenticate("google", {
                        scope: ["email", "profile"],
                        session: false,
                    }));
                    app.get("/auth/google/callback", passport_1.default.authenticate("google", {
                        successRedirect: "/auth/google/success",
                        failureRedirect: "/auth/google/failure",
                        session: false,
                    }));
                    app.get("/logout", function (req, res) {
                        req.logout();
                        res.send("logout");
                    });
                    app.use(log());
                    return [2 /*return*/, app];
            }
        });
    });
}
var isTesting = process.env.NODE_ENV === "test";
var port = isTesting ? 5000 : 3000;
if (!isTesting) {
    app.listen(port, function () {
        console.log("running on port " + port);
    });
}
exports.default = main(app);