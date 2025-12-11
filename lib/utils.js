import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sizes = [
  {label: 'S', value: 'S' },
  {label: 'M', value: 'M'} ,
  {label: 'L', value: 'L'} ,
  {label: 'XL', value: 'XL'} 

]

export const shortings = [
  {label: 'Default Sorting', value: 'default_shorting'},
  {label: 'Ascending Order', value: ' asc'},
  {label: 'Descending Order', value: ' dsc'},
  {label: 'Price Low To High', value: ' Price_Low_high'},
  {label: 'Price High To Low', value: ' Price_high_low'},
]



export const orderStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'unverified']


