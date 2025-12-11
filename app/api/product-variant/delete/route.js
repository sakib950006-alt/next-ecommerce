import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction"
import ProductVariantModel from "@/models/ProductVariant.model";





export async function PUT(request) {
    try {
        if(!auth.isAuth){
            return response(false, 403, "Unauthorized Access");
        }

await connectDB();
const payload = await request.json();

const ids = payload.ids || [];
const deleteType = payload.deleteType 

if (!Array.isArray(ids) || ids.length === 0) {
    return response(false, 400, "No IDs provided for deletion");
}

const data  = await ProductVariantModel.find({_id: { $in: ids } }).lean()
if(!data.length) {
    return response(false, 404, "No matching products found for the provided IDs");
}

if(!['SD', 'SRD'].includes(deleteType)) {
    return response (false, 400, "Invalid delete type provided");
}


 if(deleteType === "SD") {
    await ProductVariantModel.updateMany({_id: { $in: ids } }, { $set: { deletedAt: new Date() } });
 }else{
    await ProductVariantModel.updateMany({_id: { $in: ids } }, { $set: { deletedAt: null } });
 }

return response(true,200, deleteType === "SD" ? "Products soft deleted successfully" : "Products restored successfully" );

    } catch (error) {
       return catchError(error);
    }
}



export async function DELETE(request) {
    try {
        const auth = await isAuthenticated('admin');
        if(!auth.isAuth){
            return response(false, 403, "Unauthorized Access");
        }
        await connectDB();
        const payload = await request.json();

        const ids = payload.ids || [];
        const deleteType = payload.deleteType

        if(!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, "No IDs provided for deletion");
        }
const data = await ProductVariantModel.find({_id: { $in: ids } }).lean();

if(!data.length){
    return response (false, 404, 'data not found')
}

if(!deleteType === 'PD') {
    return response (false, 400, 'invalid delete operation')
}
await ProductVariantModel.deleteMany({_id:{$in:ids}})



    } catch (error) {
        return catchError(error)
    }
}