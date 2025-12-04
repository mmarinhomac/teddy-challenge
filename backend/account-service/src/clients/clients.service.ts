import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import Redis from 'ioredis';

import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { REDIS_CLIENT } from '../config/redis/redis.module';

const normalizeDocument = (value: string) => value.replace(/\D+/g, '');

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create({
      ...dto,
      status: dto.status ?? 'active',
      document: normalizeDocument(dto.document),
    });
    try {
      return await this.clientsRepository.save(client);
    } catch (error) {
      this.handleUniqueConstraintError(error);
    }
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneWithCounter(id: string): Promise<Client> {
    const redisKey = `client:views:${id}`;
    const currentViewCount = await this.redisClient.incr(redisKey);

    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.viewCount = currentViewCount;
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const payload: Partial<Client> = { ...dto };
    if (dto.document) {
      payload.document = normalizeDocument(dto.document);
    }

    const client = await this.clientsRepository.preload({
      id,
      ...payload,
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    try {
      return await this.clientsRepository.save(client);
    } catch (error) {
      this.handleUniqueConstraintError(error);
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.clientsRepository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException('Client not found');
    }
  }

  private handleUniqueConstraintError(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      error.driverError &&
      error.driverError.code === '23505'
    ) {
      const detail = (error.driverError.detail as string) ?? '';
      if (detail.includes('email')) {
        throw new BadRequestException('E-mail já está em uso.');
      }
      if (detail.includes('document')) {
        throw new BadRequestException('Documento já está em uso.');
      }
      throw new BadRequestException('Cliente já cadastrado.');
    }

    throw error;
  }
}
