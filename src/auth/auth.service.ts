import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {

  private issuer = 'login'
  private audience ='users'

  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.JWTService.sign(
        {
          id: user.id,
          user: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      )
    }
  }

  checkToken(token: string) {
    try {
      const data = this.JWTService.verify(token, {
        audience: this.audience,
        issuer: this.issuer
      })

      return data
      
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  isvalidToken(token: string) {
    try {
      this.checkToken(token)
      return true
    } catch (error) {
      return false
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email
      },
    });

    if (!user) throw new UnauthorizedException('E-mail e/ou senha incorretos.');

    if(!await bcrypt.compare(password, user.password)){
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('E-mail está incorreto.');

    // To DO: Enviar o e-mail...

    return true;
  }

  async reset(password: string, token: string) {
    // TO DO; VAlidar Token...

    const id = 0;

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {

    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}
