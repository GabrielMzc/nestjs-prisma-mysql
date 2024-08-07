import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const User = createParamDecorator((data: string, context: ExecutionContext) => {

    const request = context.switchToHttp().getRequest()

    if(request.user) {
        if(data){
            return request.user[data]
        }else{
            return request.user
        }
    }else{
        throw new NotFoundException("Usuario não encontrado no Request. Use o AuthGuard para obter o usuario.")
    }

}) 