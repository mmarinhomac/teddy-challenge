import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig, { JwtConfig } from './jwt.config';

function toSeconds(v: string | number | undefined, fallback = 3600): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v !== 'string') return fallback;

  const m = v.trim().match(/^(\d+)\s*([smhd])$/i);
  if (m) {
    const n = Number(m[1]);
    const u = m[2].toLowerCase();
    const factor = u === 's' ? 1 : u === 'm' ? 60 : u === 'h' ? 3600 : 86400;
    return n * factor;
  }
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
}

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cfg = configService.get<JwtConfig>('jwt');
        return {
          secret: cfg?.secret,
          signOptions: { expiresIn: toSeconds(cfg?.expiresIn) },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
