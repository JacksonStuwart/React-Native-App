"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

export function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const points = data.map((price, i) => ({ i, price }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={points}>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
