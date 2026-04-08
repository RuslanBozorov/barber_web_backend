import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (Ruhsat: Hamma)' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Incorrect data format' })
  @ApiResponse({ status: 409, description: 'Phone number already exists in our database' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and get JWT token (Ruhsat: Hamma)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful login',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid login or password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
