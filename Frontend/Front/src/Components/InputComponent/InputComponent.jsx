import './InputComponent.css'

export default function InputComponent({id,type, placeholder, width, style}){
    return(
        <div className="input-group">
                    <input 
                        type={type}
                        id={id} 
                        className="floating-input" 
                        placeholder={''} 
                        autocomplete="off"
                        width={width}
                        style={style}
                        />
                    <label for="nameInput" className="floating-label">{placeholder}</label>
        </div>


    )
}
