import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      // 1. Hash the password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 2. Try creating user
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      return this.generateToken(user);
    } catch (error) {
      // 3. Handle conflict error (phone number unique constraint)
      if (error.code === 'P2002') {
        throw new ConflictException('This phone number is already registered.');
      }
      
      // 4. Log and throw generic error if something else fails
      console.error('Registration error:', error);
      throw new InternalServerErrorException(
        'Registration failed. This might be due to a database connection issue or invalid data.'
      );
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
