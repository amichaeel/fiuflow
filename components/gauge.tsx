import {
    PolarAngleAxis, // Import this
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import { Label } from "recharts" // Assuming Label is from recharts, or your UI lib

import {
    ChartContainer,
    ChartConfig, // Assuming you have ChartConfig type if chartConfig is used
} from "@/components/ui/chart" // Adjust path as needed

// Minimal chartConfig, adjust if you have more defined
const chartConfig = {
    visitors: {
        label: "Visitors",
        color: "hsl(var(--chart-1))", // Default color, will be overridden by direct fill
    },
} satisfies ChartConfig // Use 'as const' or 'satisfies ChartConfig' if you have that type

interface GaugeProps {
    numerator: number
    denominator: number
}

export function Gauge({ numerator, denominator }: GaugeProps) {
    const percentage = denominator === 0 ? 0 : Math.round((numerator / denominator) * 100)

    const chartData = [
        { browser: "safari", visitors: percentage, fill: "#00B7D5" }, // Using direct fill
    ]

    return (
        <ChartContainer config={chartConfig} className="p-0 m-0 aspect-square h-full max-h-[250px]">
            <RadialBarChart
                data={chartData}
                startAngle={360}
                endAngle={0}
                innerRadius={80}
                outerRadius={110}
                barSize={16}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                />
                <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                />
                <RadialBar
                    dataKey="visitors"
                    angleAxisId={0}
                    background
                    cornerRadius={0}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-4xl font-bold"
                                        >
                                            {percentage}%
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            liked
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </PolarRadiusAxis>
            </RadialBarChart>
        </ChartContainer>
    )
}