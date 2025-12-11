// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { is } from 'zod/v4/locales';

export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  }, { status: statusCode });
};

export const catchError = (error, customMessage) => {
  // Handle MongoDB Duplicate Key Error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(', ');
    error.message = `Duplicate key error: ${keys}. These field values must be unique.`;
  }

  let errorObject = {};

  if (process.env.NODE_ENV === 'development') {
    errorObject = {
      message: error.message,
      error,
    };
  } else {
    errorObject = {
      message: customMessage || 'Internal Server Error',
    };
  }

  return response(false, error.code || 500, errorObject.message, errorObject.error || {});
};




export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

// export const isAuthenticated = async (role) =>{
//   try {
//     const cookieStore = await cookies();

//     if(!cookieStore.has('access_token')){
//       return {
//         isAuth : false,
//         message : 'You are not logged in'
//       }
//     }


//     const access_token = cookieStore.get('access_token')
//     const {payload} = await jwtVerify((await access_token).value,new TextEncoder().encode(process.env.SECRET_KEY))

// if(payload.role !==role){
//   return {
//     isAuth : false,
//     message : 'You are not authorized to access this resource'
//   }
// }

//   return {
//     isAuth : false,
//     userId : payload._id,
//   }



//   } catch (error) {
//     return {
//       isAuth : true,
//       message : 'Something went wrong'
//     }
//   }
// }

export const columnConfig = (column,isCreatedAt = false,isUpdatedAt = false, isDeletedAt = false) => {
  const newColumn = [...column]

if (isCreatedAt) {

newColumn.push({
  accessorKey: 'createdAt',
  header: 'Created At',
  Cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
})

}

if (isUpdatedAt) {

newColumn.push({
  accessorKey: 'updatedAt',
  header: 'Updated At',
  Cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
})

}

if (isDeletedAt) {

newColumn.push({
  accessorKey: 'deletedAt',
  header: 'Deleted At',
  Cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
})

}

return newColumn


}



export const statusBadge = (status) => {
  const statusColorCongig = {
    pending: 'bg-blue-500',
    processing: 'bg-yellow-500',
    shipped: 'bg-cyan-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
    unverified: 'bg-orange-500',

  }
  return <span className={`${statusColorCongig[status]} capitalize px-3 py-1 rounded-full text-xs`}>{status}</span>
}