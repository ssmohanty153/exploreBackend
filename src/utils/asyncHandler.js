const asuncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            next(error)
        })
    }
}
export { asuncHandler }


// const asyncHandlerTryCatch= (fn) => {
//     async (req, res, next) => {
//         try {

//         } catch (error) {
//             res.status(err.code || 500).json({
//                 success: false,
//                 message: err.message
//             })
//         }
//     }
// }

