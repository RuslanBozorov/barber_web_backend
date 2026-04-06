import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('avatar')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const url = await this.uploadService.uploadFile(file, 'avatars');
    await this.prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: url },
    });
    return { url };
  }

  @Post('banner')
  @ApiOperation({ summary: 'Upload master banner image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const url = await this.uploadService.uploadFile(file, 'banners');
    await this.prisma.masterProfile.upsert({
      where: { userId: req.user.id },
      update: { bannerImage: url },
      create: { userId: req.user.id, bannerImage: url },
    });
    return { url };
  }

  @Post('salon-images')
  @ApiOperation({ summary: 'Upload salon images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } } },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadSalonImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await this.uploadService.uploadMultipleFiles(files, 'salons');
    return { urls };
  }
}
