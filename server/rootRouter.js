const { Router } = require('express')
const {resizeAndZip} = require('./imageService')

const rootRouter = Router()

rootRouter.post('/image-zip', async (req, res, next) => {
    try {
        console.log(req.body);
        const {width, height, extension} = req.body
        const zipBuffer = await resizeAndZip(width, height, extension)
        const fileName = `${(new Date()).valueOf()}.zip`;
        const fileType = 'application/zip';
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': fileType,
        })
        return res.end(zipBuffer) 
    } catch(e) {
        console.log(e);
        res.sendStatus(500)
    }
})

module.exports = rootRouter