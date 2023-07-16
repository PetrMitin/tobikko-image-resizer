import { ImageExtension } from "../types/UITypes";
import {API_URL} from '../utils/consts'
import { saveAs } from 'file-saver'

export async function resizeZipSave(width: number, height: number, extension: ImageExtension) {
    const zipBuffer = await (await fetch(`${API_URL}/image-zip`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({width, height, extension})
    })).blob()
    saveAs(zipBuffer, `${(new Date()).valueOf()}.zip`)
}