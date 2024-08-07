import { AuthService } from './auth.service';
import { Body, Controller, Post, Headers, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthGuard } from 'src/guards/aurh.guard';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { UserService } from 'src/user/user.service';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController{

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly fileservice: FileService
    ){}

    @Post('login')
    async login(@Body() body: AuthLoginDTO){
        return this.authService.login(body.email, body.password)
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO){
        return this.authService.register(body)
    }

    @Post('forget')
    async forget(@Body() body: AuthForgetDTO){
        return this.authService.forget(body.email)
    }

    @Post('reset')
    async reset(@Body() body: AuthResetDTO){
        return this.authService.reset(body.password, body.token)
    }

    @UseGuards(AuthGuard)
    @Post('me') 
    async me(@User('id') user){
        return {user}
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo') 
    async uploadPhoto(
        @User() user, 
        @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType: 'image/png'}),
                new MaxFileSizeValidator({maxSize: 1024 * 1000})
            ]
        })) 
        photo: Express.Multer.File
    ){

        const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.jpg`)
        try {
            await this.fileservice.upload(photo, path)
        } catch (error) {
            throw new BadRequestException(error)
        }

        return {success: true}
    }

}