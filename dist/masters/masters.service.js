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
exports.MastersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MastersService = class MastersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, lat, lng, radiusInKm = 10) {
        const skip = (page - 1) * limit;
        const masters = await this.prisma.masterProfile.findMany({
            where: { deletedAt: null },
            skip,
            take: limit,
            include: {
                user: { select: { name: true, phone: true, avatar: true } },
                salon: { select: { name: true, address: true } },
            },
            orderBy: { rating: 'desc' },
        });
        const total = await this.prisma.masterProfile.count({ where: { deletedAt: null } });
        return { data: masters, total, page, limit };
    }
    async findOne(id) {
        const master = await this.prisma.masterProfile.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, phone: true, avatar: true } },
                salon: true,
                services: { include: { service: true } },
            },
        });
        if (!master || master.deletedAt) {
            throw new common_1.NotFoundException('Master not found');
        }
        return master;
    }
    async updateProfile(userId, dto) {
        return this.prisma.masterProfile.upsert({
            where: { userId },
            update: dto,
            create: {
                userId,
                ...dto,
            },
        });
    }
};
exports.MastersService = MastersService;
exports.MastersService = MastersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MastersService);
//# sourceMappingURL=masters.service.js.map