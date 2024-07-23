const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb( null, './public/img/' )
    },
    filename: (req, file, cb) => {
        const sulfixo_Unico = Date.now() + '-' + Math.round( Math.random() * 1e9 )
        cb( null, file.fieldname + '-' + sulfixo_Unico + '-' + file.originalname )
    }
})

const upload = multer( { storage } )

module.exports = upload