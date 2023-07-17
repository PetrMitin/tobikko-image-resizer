import { ImageExtension } from "../types/UITypes";
import {API_URL} from '../utils/consts'
import { saveAs } from 'file-saver'

export async function resizeUserImages(images: FileList, width: number, height: number, extension: ImageExtension) {
    const body = new FormData()
    for (let i = 0; i < images.length; i++) {
        const image = images[i]
        body.append('images', image)
    }
    body.append('width', width.toString())
    body.append('height', height.toString())
    body.append('extension', extension)
    const response = await fetch(`${API_URL}/user-images`, {
        method: 'POST',
        body
    })
    if (response.ok) {
        const zipBuffer = await response.blob()
        saveAs(zipBuffer, `${(new Date()).valueOf()}.zip`)
    }
}

export async function resizeServerImages(width: number, height: number, extension: ImageExtension) {
    const response = await fetch(`${API_URL}/server-images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({width, height, extension})
    })
    if(response.ok) {
        const zipBuffer = await response.blob()
        saveAs(zipBuffer, `${(new Date()).valueOf()}.zip`)
    }
}