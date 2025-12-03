import { Chart } from './chart';
import { Summary } from './summary';

export function DashContent() {
  return (
    <div className="pt-8 px-2 pb-4">
      <Summary />
      <Chart />
    </div>
  );
}
