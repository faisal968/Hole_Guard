import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
 

  const baseUrl = "http://192.168.1.3:8000/api/user/";


export const UserAuthApi = createApi({
  reducerPath: 'UserAuthApi',
  baseQuery: fetchBaseQuery({  baseUrl }),
  endpoints: (build) => ({
    registerUser: build.mutation({
       query:(user)=>{
        return{
          url:"register/",
          method:"POST",
          body:user,
          headers:{
            'Content-type':'application/json'
          }
        }
       

       }
    }),
    loginUser: build.mutation({
      query:(user)=>{
       return{
         url:"login/",
         method:"POST",
         body:user,
         headers:{
           'Content-type':'application/json'
         }
       }
      

      }
   }),

getLoggedUser: build.query({
      query:(token)=>{
       return{
         url:"profile/",
         method:"GET",
         headers:{
           'Authorization':`Bearer ${token}`,
         }
       }
      

      }
   }),
   ChangeUserPassword: build.mutation({
    query: ({ formData, access }: { formData: any; access: string }) => ({
      url: "changePassword/",
      method: "POST",
      body: formData,  
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }),
  }),
  
  }),
})

 
export const {useRegisterUserMutation,useLoginUserMutation,useGetLoggedUserQuery,useChangeUserPasswordMutation} =UserAuthApi