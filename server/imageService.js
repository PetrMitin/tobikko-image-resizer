const axios = require('axios')
const sharp = require('sharp')
const JSZip = require('jszip')
const {Agent} = require('https')

class ImageService {
    constructor() {
        const httpsAgent = new Agent({
            rejectUnauthorized: false,
        })
        this.instance = axios.create({
            baseURL: process.env.IMAGE_BASE_URL,
            httpsAgent
        })
    }

    getAllItemData = async () => {
        const res = await this.instance.get('/api/items')
        const items = res.data
        return items
    }

    getImageFile = async (filename) => {
        const url = `${process.env.IMAGE_BASE_URL}/${filename}`
        return (await this.instance.get(url, {responseType: 'arraybuffer'})).data
    }

    resizeImage = async (image, width, height, extension) => {
        let sharpInstance = sharp(image)
        if (!width) {
            sharpInstance = sharpInstance.resize({height})
        } else if (!height) {
            sharpInstance = sharpInstance.resize({width})
        } else if (width && height) {
            sharpInstance = sharpInstance.resize({width, height, fit: 'contain'})
        }
        return sharpInstance.toFormat(extension)
    }

    resizeUserImages = async (images, width, height, extension) => {
        const zip = new JSZip();
        await Promise.all(images.map(async image => {
            const resizedImage = await this.resizeImage(image.buffer, width, height, extension)
            const filename = image.originalname.split('.')[0]
            zip.file(`${filename}-resized.${extension}`, await resizedImage.toBuffer())
        }))
        const zipBuffer = await zip.generateAsync({type: 'nodebuffer'})
        return zipBuffer
    }

    resizeServerImages = async (width, height, extension) => {
        const itemData = await this.getAllItemData()
        const zip = new JSZip();
        await Promise.all(itemData.map(async item => {
                const imageFile = await this.getImageFile(item.image)
                const resizedImage = await this.resizeImage(imageFile, width, height, extension)
                zip.file(`${item.name}-resized.${extension}`, await resizedImage.toBuffer())
        }))
        const zipBuffer = await zip.generateAsync({type: 'nodebuffer'})
        return zipBuffer
    }
}

module.exports = new ImageService()