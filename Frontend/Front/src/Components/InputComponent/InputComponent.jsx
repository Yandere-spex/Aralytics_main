import './InputComponent.css'

export default function InputComponent({id,type, placeholder, width}){
    return(
        <div className="input-group">
                    <input 
                        type={type}
                        id={id} 
                        className="floating-input" 
                        placeholder={''} 
                        autocomplete="off"
                        width={width}
                        />
                    <label for="nameInput" className="floating-label">{placeholder}</label>
        </div>


    )
}
