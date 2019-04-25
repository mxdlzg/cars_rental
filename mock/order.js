export default {
    'GET /api/car/*':{
        id:1
    },

    'GET /api/order/queryPrice':(req,res)=>{
        setTimeout(()=>{
            res.send({
                status:"ok",
            })
        },1000)
    }
}