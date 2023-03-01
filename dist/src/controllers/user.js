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
const user_model_1 = __importDefault(require("../models/user_model"));
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send({ 'error': 'Failed to get user from DB' });
    }
});
const upadteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.id);
    console.log(req.body.avatarUrl);
    console.log(req.body.name);
    const name = req.body.name;
    const avatarUrl = req.body.avatarUrl;
    const id = req.body.id;
    try {
        const user = yield user_model_1.default.findByIdAndUpdate(id, {
            $set: {
                name,
                avatarUrl,
            }
        });
        yield user.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
module.exports = { getUserById, upadteUser };
//# sourceMappingURL=user.js.map