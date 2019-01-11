export interface Data {
  title: string;
  data: PieData[];
}

interface PieData {
  name: string;
  value: number;
}
