"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"

export const description = "A bar chart"

const chartData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 237 },
  { month: "April", amount: 73 },
  { month: "May", amount: 209 },
  { month: "June", amount: 214 },
  { month: "july", amount: 313 },
  { month: "august", amount: 455 },
  { month: "september", amount: 205 },
  { month: "auctober", amount: 620 },
  { month: "november", amount: 520 },
  { month: "december", amount: 150 },
]


const months = [

"January",
"February",
"March",
"April",
"May",
"June",
"july",
"august",
"september",
"auctober",
"november",
"december",

]

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#8e51ff",
  },
} 

export function OrderOverview() {

const [chartData, setChartData] = useState([])
const  {data: monthlySales, loading} = useFetch('/api/dashboard/admin/monthly-sales')
useEffect(()=>{
    if(monthlySales && monthlySales .success) {
   const getChartData = months.map((month, index) => {
         const monthData = monthlySales.data.find(item => item._id.month === index + 1)
         return {
          month: month,
          amount: monthData? monthData.totalSales : 0
         }
   })
   setChartData(getChartData)
    }
}, [monthlySales])

  return (
  <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
          </BarChart>
        </ChartContainer>
  )
}
