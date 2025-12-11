import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const BreadCrumb = ({breadcrumbData}) => {
  return (
 <Breadcrumb className="mb-5">
  <BreadcrumbList>
    {breadcrumbData.length > 0 && breadcrumbData.map((data,index)=>{
        return(
            index !== breadcrumbData.length -1 
            ?
            <div key={index} className="flex items-center">
<BreadcrumbItem>
<BreadcrumbLink href={data.href}>
{data.label}
</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator className="ml-4" />
            </div>
            :
            <div key={index} className="flex items-center">
                <BreadcrumbItem>
<BreadcrumbLink href={data.href}>
{data.label}
</BreadcrumbLink>
</BreadcrumbItem>

            </div>
        )
    })}
  </BreadcrumbList>
</Breadcrumb>
  )
}

export default BreadCrumb