import { AuthGuard } from 'src/guards/aurh.guard';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('users')
export class UserController {

  constructor(private readonly UserService: UserService){}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.UserService.create(data);
  }

  @Get()
  async read() {
    return this.UserService.list()
  }

  @Get(':id')
  async readOne(@ParamId() id:number) {
    return this.UserService.findOne(id)
  }

  @Put(':id')
  async update(@Body() body: UpdateUserDTO, @Param('id', ParseIntPipe) id:number) {
    return this.UserService.update(body, id)
  }

  @Patch(':id') 
  async updatePatial(@Body() body: UpdatePartialUserDTO,@Param('id', ParseIntPipe) id:number) {
    return this.UserService.updatePartial(body, id)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id:number) {
    return this.UserService.deleteOne(id)
  }
}