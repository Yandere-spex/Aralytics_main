import './InputComponent.css'

export default function InputComponent({id,type, placeholder}){
    return(
        <div className="input-group">
                    <input 
                        type={type}
                        id={id} 
                        className="floating-input" 
                        placeholder={''} 
                        autocomplete="off"
                        />
                    <label for="nameInput" className="floating-label">{placeholder}</label>
        </div>


    )
}
