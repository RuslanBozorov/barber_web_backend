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
exports.SalonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SalonsService = class SalonsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, lat, lng) {
        const skip = (page - 1) * limit;
        const salons = await this.prisma.salon.findMany({
            where: { deletedAt: null },
            skip,
            take: limit,
            include: {
                owner: { select: { name: true, phone: true } },
            },
        });
        const total = await this.prisma.salon.count({ where: { deletedAt: null } });
        return { data: salons, total, page, limit };
    }
    async findOne(id) {
        const salon = await this.prisma.salon.findUnique({
            where: { id },
            include: {
                masters: { include: { user: { select: { name: true, avatar: true } } } },
            },
        });
        if (!salon || salon.deletedAt) {
            throw new common_1.NotFoundException('Salon not found');
        }
        return salon;
    }
    async updateProfile(ownerId, dto) {
        const fallbackName = dto.name || 'My Salon';
        return this.prisma.salon.upsert({
            where: { ownerId },
            update: dto,
            create: {
                ownerId,
                name: fallbackName,
                ...dto,
            },
        });
    }
};
exports.SalonsService = SalonsService;
exports.SalonsService = SalonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalonsService);
//# sourceMappingURL=salons.service.js.map