import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'/uploads')
    },
    filename(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname.replace(/\s+/g,'-')}`)
    }
})

const fileFilter = (req,file,cb)=>{
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype){
        cb(null,true)
    }else{
        cb(new Error('only image files(jpeg|jpg|png|webp) are allowed'),false)
    }
}

const uplaod = multer({
    storage,
    limits:{fileSize:5*1024*1024},
    fileFilter
})

export default uplaod;