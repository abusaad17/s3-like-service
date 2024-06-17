"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketSchema = exports.Bucket = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_validator_1 = require("class-validator");
let Bucket = class Bucket extends mongoose_2.Document {
};
exports.Bucket = Bucket;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Bucket.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Bucket.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Bucket.prototype, "isDelete", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Bucket.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], Bucket.prototype, "files", void 0);
exports.Bucket = Bucket = __decorate([
    (0, mongoose_1.Schema)()
], Bucket);
exports.BucketSchema = mongoose_1.SchemaFactory.createForClass(Bucket);
//# sourceMappingURL=bucket.model.js.map