const { Router } = require('express')
const {resizeUserImages, resizeServerImages} = require('./imageService')

const rootRouter = Router()

rootRouter.post('/server-images', async (req, res, next) => {
    try {
        const {width, height, extension} = req.body
        const zipBuffer = await resizeServerImages(width, height, extension)
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

rootRouter.post('/user-images', async (req, res, next) => {
    try {
        let {width, height, extension} = req.body
        width = parseInt(width)
        height = parseInt(height)
        const zipBuffer = await resizeUserImages(req.files, width, height, extension)
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