import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

const normalizeDocument = (value: string) => value.replace(/\D+/g, '');

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>
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
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientsRepository.increment({ id }, 'viewCount', 1);
    const updated = await this.clientsRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Client not found');
    }
    return updated;
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
