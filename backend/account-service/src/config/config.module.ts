import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';

export const ENV = 'ENV';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          const formatted = parsed.error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join('; ');
          throw new Error(`Invalid environment configuration: ${formatted}`);
        }
        return parsed.data;
      },
    }),
  ],
  providers: [
    {
      provide: ENV,
      useFactory: () => envSchema.parse(process.env),
    },
  ],
  exports: [ENV],
})
export class AppConfigModule {}
