import { ChangeEventHandler, FC, useState } from "react"
import { resizeZipSave } from "../actions/imageActions"
import { ImageExtension, JPEG, PNG, WEBP } from "../types/UITypes"
import Loader from "./Loader"
import './MainMenu.css'

const MainMenu: FC = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [extension, setExtension] = useState<ImageExtension>('jpeg')
    const [loading, setLoading] = useState(false)

    const handleWidthChange: ChangeEventHandler<HTMLInputElement> = (e) => setWidth(parseInt(e.target.value) || 0)

    const handleHeightChange: ChangeEventHandler<HTMLInputElement> = (e) => setHeight(parseInt(e.target.value) || 0)

    const handleExtensionChange: ChangeEventHandler<HTMLSelectElement> = (e) => setExtension(
                                                                                    (e.target.value === JPEG 
                                                                                        || e.target.value === PNG 
                                                                                        || e.target.value === WEBP) 
                                                                                    ? e.target.value 
                                                                                    : JPEG
                                                                                )

    const handleSubmit = async () => {
        if (!width && !height) window.alert("Укажите хотя бы один из параметров: ширина, высота") 
        else if (!extension) window.alert("Расширение изображения не выбрано!")
        else {
            setLoading(true)
            await resizeZipSave(width, height, extension)
            setLoading(false)
        }
    }

    return (
        <div id="main-menu">
            <h1>Редактор размеров изображений Tobikko Sushi</h1>
            <label>
                <h3>Ширина изображения, px</h3>
                <p>Если вы ввели высоту изображения и хотите, чтобы соотношение ширины и высоты осталось прежним, оставьте это поле пустым</p>
                <input type='number' onChange={handleWidthChange} />
            </label>
            <label>
                <h3>Высота изображения, px</h3>
                <p>Если вы ввели ширину изображения и хотите, чтобы соотношение ширины и высоты осталось прежним, оставьте это поле пустым</p>
                <input type='number' onChange={handleHeightChange} />
            </label>
            <label>
                <h3>Выберите расширение</h3>
                <select name="extension-select" id="extension-select" onChange={handleExtensionChange}>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value='webp'>WEBP</option>
                </select>
            </label>
            <br/>
            <button onClick={handleSubmit} id="submit-button" disabled={loading}>
                {loading ? <Loader/> : "Изменить размеры и загрузить"}
            </button>
        </div>
    )
}

export default MainMenu