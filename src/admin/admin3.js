const express = require('express')
const router = express.Router()


router.route('/member/edit/:id')
.all((req,res,next)=>{
    res.locals.memberData={
        name:"shao",
        id:req.params.id
    }
    next()
})
.get((req,res)=>{
    res.send("get:"+JSON.stringify(res.locals))
})
.post((req,res)=>{
    res.send("post:"+JSON.stringify(res.locals))
})

// router.get('/admin3/:p1?/:p2?',(req,res)=>{
//    result={
//        "params":req.params,
//        "url":req.url,
//        "baseUrl":req.baseUrl
//    }
//    res.json(result)

// })

module.exports = router ;