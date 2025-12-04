import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shadcn/components/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/select';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/components/toggle-group';
import { Skeleton } from '@/shadcn/components/skeleton';

import { useDashboard } from '../context';

export const description = 'An interactive area chart';

const chartConfig = {
  visitors: {
    label: 'Visitas',
  },
  clients: {
    label: 'Novos clientes',
    color: 'var(--primary)',
  },
  users: {
    label: 'Novos usuários',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('90d');
  const { data, loading } = useDashboard();

  const chartData = React.useMemo(() => data?.growthData ?? [], [data]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.day);
    const today = new Date();
    const referenceDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const renderChartBody = () => {
    if (loading) {
      return <Skeleton className="h-[250px] w-full" />;
    }

    if (!filteredData.length) {
      return (
        <div className="flex h-[250px] w-full items-center justify-center text-sm text-muted-foreground">
          Sem dados suficientes para montar o gráfico.
        </div>
      );
    }

    return (
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart
          data={filteredData.map((item) => ({
            date: item.day,
            clients: item.newClients,
            users: item.newUsers,
          }))}
        >
          <defs>
            <linearGradient id="fillClients" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-clients)"
                stopOpacity={1}
              />
              <stop
                offset="95%"
                stopColor="var(--color-clients)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-users)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-users)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('pt-BR', {
                month: 'short',
                day: 'numeric',
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString('pt-BR', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="users"
            type="natural"
            fill="url(#fillUsers)"
            stroke="var(--color-users)"
            stackId="a"
          />
          <Area
            dataKey="clients"
            type="natural"
            fill="url(#fillClients)"
            stroke="var(--color-clients)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    );
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Clientes</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total de visitantes nos últimos 3 meses
          </span>
          <span className="@[540px]/card:hidden">Últimos 3 meses</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 dias</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {renderChartBody()}
      </CardContent>
    </Card>
  );
}
