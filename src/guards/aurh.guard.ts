import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ){}

    async canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest()

        const { authorization } = request.headers

        try {
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1])

            request.user = await this.userService.findOne(data.id)

            request.tokenPayload = data

            return true

        } catch (error) {
            return false
        } 
    }
}