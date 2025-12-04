import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/shadcn/components/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/card';
import { Skeleton } from '@/shadcn/components/skeleton';

import { useDashboard } from '../context';

export function SectionCards() {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const { totals, recentActivity } = data;

  const cards = [
    {
      title: 'Clientes ativos',
      description: 'Total',
      value: totals.totalActiveClients.toLocaleString('pt-BR'),
      trendLabel: 'Última atualização há 5 minutos',
      badge: '+100% vs ontem',
      icon: IconTrendingUp,
    },
    {
      title: 'Usuários do sistema',
      description: 'Total',
      value: totals.totalSystemUsers.toLocaleString('pt-BR'),
      trendLabel: 'Administradores e operadores',
      badge: '+0% hoje',
      icon: IconTrendingUp,
    },
    {
      title: 'Visualizações acumuladas',
      description: 'Total',
      value: totals.totalClientViews.toLocaleString('pt-BR'),
      trendLabel: 'Sincronizado a cada 5 minutos',
      badge: '+Redis',
      icon: IconTrendingUp,
    },
    {
      title: 'Novos clientes (30m)',
      description: 'Mais Recentes',
      value: recentActivity.clientsCreatedLast30Minutes.toLocaleString('pt-BR'),
      trendLabel:
        recentActivity.clientsCreatedLast30Minutes > 0
          ? 'Entrada constante'
          : 'Sem novos cadastros',
      badge:
        recentActivity.clientsCreatedLast30Minutes > 0 ? '+Em alta' : 'Estável',
      icon:
        recentActivity.clientsCreatedLast30Minutes > 0
          ? IconTrendingUp
          : IconTrendingDown,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map(
        (
          { title, description, value, trendLabel, badge, icon: Icon },
          index
        ) => (
          <Card key={title + index} className="@container/card">
            <CardHeader>
              <CardDescription>{description}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Icon className="size-4" />
                  {badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {title} <Icon className="size-4" />
              </div>
              <div className="text-muted-foreground">{trendLabel}</div>
            </CardFooter>
          </Card>
        )
      )}
    </div>
  );
}
