"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addElement = exports.CreateMap = exports.createAvatar = exports.updateElememt = exports.CreateElement = exports.CreateSpace = exports.UserSignin = exports.UserSignup = void 0;
const zod_1 = require("zod");
exports.UserSignup = zod_1.z.object({
    username: zod_1.z.string({ required_error: "username cant be empty" })
        .min(3, { message: "atleast of 3 letter" }),
    password: zod_1.z.string({ required_error: "password cannot be empty" })
        .min(3, { message: "atleast of 3 digit" }),
    role: zod_1.z.enum(["Admin", "User"])
});
exports.UserSignin = zod_1.z.object({
    username: zod_1.z.string({ required_error: "username cant be empty" })
        .min(3, { message: "atleast of 3 letter" }),
    password: zod_1.z.string({ required_error: "password cannot be empty" })
        .min(3, { message: "atleast of 3 digit" }),
});
exports.CreateSpace = zod_1.z.object({
    name: zod_1.z.string({ required_error: "name of the space is required" })
        .min(3, { message: "atleast 3 letter room name please" }),
    mapId: zod_1.z.string().optional()
});
//create a element
exports.CreateElement = zod_1.z.object({
    width: zod_1.z.number({ required_error: "width required" }),
    height: zod_1.z.number({ required_error: "height required" }),
    imageUrl: zod_1.z.string({ required_error: "url is required" })
        .url({ message: "please give a valid url" }),
    static: zod_1.z.boolean({ required_error: "please give static type of the element" })
});
//update element
exports.updateElememt = zod_1.z.object({
    imageUrl: zod_1.z.string({
        required_error: "image is required"
    }).url({ message: "give a valid url" })
});
//create avatar
exports.createAvatar = zod_1.z.object({
    imageUrl: zod_1.z.string({
        required_error: "image is required"
    }).url({ message: "give a valid url" }),
    name: zod_1.z.string({ required_error: "give a valid url" })
});
//create map
exports.CreateMap = zod_1.z.object({
    thumbnail: zod_1.z.string({ required_error: "thumnail is rquire" })
        .url({ message: "url is rquired" }),
    name: zod_1.z.string({ required_error: "name is required" }),
    dimensions: zod_1.z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElement: zod_1.z.array(zod_1.z.object({
        elementId: zod_1.z.string(),
        x: zod_1.z.number(),
        y: zod_1.z.number(),
    }))
});
//add a element in the space
exports.addElement = zod_1.z.object({
    elementId: zod_1.z.string(),
    spaceId: zod_1.z.string(),
    x: zod_1.z.number(),
    y: zod_1.z.number()
});
