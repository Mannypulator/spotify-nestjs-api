import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    // check if user exists with the same email
    const userExists = await this.userRepository.findOneBy({
      email: userDTO.email,
    });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const salt = bcrypt.genSaltSync(10);
    userDTO.password = await bcrypt.hash(userDTO.password, salt);
    const user = await this.userRepository.save(userDTO);
    delete user.password;
    return user;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) throw new UnauthorizedException('User not found!');
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    //find user by id
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.delete(id);
  }
}
