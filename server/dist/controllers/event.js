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
Object.defineProperty(exports, "__esModule", { value: true });
const associations_1 = require("../models/associations");
// import { v4 as uuidv4 } from 'uuid'
const uuid_1 = require("uuid");
// Needs body with at least {"title"} 
const newEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('eo', (0, uuid_1.validate)(req.params.userid));
    if (!(0, uuid_1.validate)(req.params.userid)) {
        return res.status(400)
            .json({
            success: false,
            error: "400",
            data: null,
            message: "Wrong uuid"
        });
    }
    const user = yield associations_1.User.findOne({
        where: { userId: req.params.userid }
    });
    if (!user) {
        return res.status(400)
            .json({
            success: false,
            error: "400",
            data: null,
            message: "Wrong host id"
        });
    }
    if (!req.body.title) {
        return res.status(400)
            .json({
            success: false,
            error: "400",
            data: null,
            message: "Missing input data"
        });
    }
    try {
        const event = yield associations_1.Event.create(req.body);
        //@ts-ignore
        yield associations_1.UserEvent.create({ userId: req.params.userid, eventId: event.eventId, isHost: true });
        res.status(201)
            .json({
            success: true,
            error: null,
            data: event,
            message: 'Event created and linked to host',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json({ message: err.message });
    }
});
// Needs req.params.eventid
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield associations_1.Event.findOne({
            where: { eventId: req.params.eventid }
        });
        if (!event) {
            return res.status(404)
                .json({
                success: false,
                error: "404",
                data: null,
                message: "No event found"
            });
        }
        res.status(200)
            .json({
            success: true,
            error: null,
            data: event,
            message: 'Event fetched',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json({ message: err.message });
    }
});
// Needs req.params.eventid
// Needs body with the changes 
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEvent = yield associations_1.Event.update(req.body, {
            where: { eventId: req.params.eventid },
            returning: true
        });
        res.status(200)
            .json({
            success: true,
            error: null,
            data: updatedEvent[1][0],
            message: 'Event updated',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500)
            .json({ message: err.message });
    }
});
// Needs req.params.eventid
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventExists = yield associations_1.Event.findOne({ where: { eventId: req.params.eventid } });
        if (!eventExists) {
            return res.status(400)
                .json({
                success: false,
                error: 400,
                data: null,
                message: "Wrong event id",
            });
        }
        const deletedEvent = yield associations_1.Event.destroy({ where: { eventId: req.params.eventid } });
        res.status(200)
            .json({
            success: true,
            error: null,
            data: deletedEvent,
            message: 'Event deleted',
        });
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(400)
            .json({ message: err.message });
    }
});
// Needs req.params.userid
const getUserEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventIds = yield associations_1.UserEvent.findAll({
            where: { userId: req.params.userid }
        });
        if (eventIds.length) {
            const eventsArray = [];
            for (const event of eventIds) {
                eventsArray.push(event.dataValues.eventId);
            }
            const events = yield associations_1.Event.findAll({
                where: { eventId: eventsArray }
            });
            res.status(200).json({
                success: true,
                error: null,
                data: events,
                message: 'User events fetched',
            });
        }
        else {
            throw new Error('No events where found');
        }
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.default = { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents };
