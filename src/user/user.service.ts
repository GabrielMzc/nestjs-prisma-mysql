import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async create({email, name, password, role}: CreateUserDTO) {

        const salt = await bcrypt.genSalt()

        const passwordHash =  await bcrypt.hash(password, salt)

        return this.prisma.user.create({
            data: {
                email,
                name,
                password: passwordHash,
                role
            },
        })
    }

    async list() {
        return this.prisma.user.findMany()
    }

    async findOne(id:number) {
        
        await this.exists(id)

        return this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
    }

    async update({email, password, name, birthAt, role}: UpdateUserDTO, id:number) {

        await this.exists(id)

        const salt = await bcrypt.genSalt()

        const passwordHash =  await bcrypt.hash(password, salt)

        if(!birthAt) birthAt = null

        return this.prisma.user.update({
            data: {email, password: passwordHash, name, birthAt: birthAt ? new Date(birthAt) : null, role},
            where:{
                id: id
            }
        })
    }

    async updatePartial({email, password, name, birthAt, role}: UpdatePartialUserDTO, id:number) {

        await this.exists(id)

        const data:any = {}

        if(birthAt) data.birthAt = new Date(birthAt)
        if(email) data.email = email
        if(password) {
            const salt = await bcrypt.genSalt()
            const passwordHash =  await bcrypt.hash(password, salt)
            data.password = passwordHash
        }
        if(name) data.name = name
        if(role) data.role = role

        return this.prisma.user.update({
            data,
            where:{
                id: id
            }
        })
    }

    async deleteOne(id:number) {
        
        await this.exists(id)

        return this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    async exists(id:number) {
        if(!(await this.prisma.user.count({
            where: {
                id
            }
        }))) throw new NotFoundException('Usuario com o id informado é inexistente')
    }


}