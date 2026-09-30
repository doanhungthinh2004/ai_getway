"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageRouter = void 0;
const express_1 = require("express");
const usageController_1 = require("../controllers/usageController");
const auth_1 = require("../middleware/auth");
exports.usageRouter = (0, express_1.Router)();
exports.usageRouter.get('/', auth_1.requireAuth, usageController_1.usageController.getUsage.bind(usageController_1.usageController));
