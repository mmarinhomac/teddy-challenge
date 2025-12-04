import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  is_admin: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) {
      return;
    }

    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const isAlreadyHashed = this.password.startsWith('$2b$');

    this.password = isAlreadyHashed
      ? this.password
      : await bcrypt.hash(this.password, rounds);
  }
}
