class apiResponse {
    constructor(statusCode,data,message="success"){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.success=statusCode
    }
}
// const apiResponse = (statusCode,data,message)=>{
//     return (
//         {
//             statusCode:statusCode,
//             data:data,
//             message:message
//         }
//     )
// }
export {apiResponse}
