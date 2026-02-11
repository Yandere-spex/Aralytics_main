import './InputComponent.css'

export default function InputComponent({ id, type, name, placeholder, value, onChange, error, width, style }) {
    return (
        <div className="input-group">
            <input 
                type={type}
                id={id}
                name={name}  // Added
                className="floating-input" 
                placeholder={''} 
                autoComplete="off"
                value={value}  // Added
                onChange={onChange}  // Added
                style={style}
            />
            <label htmlFor={id} className="floating-label">{placeholder}</label>
            {error && <span className="error-message" style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
        </div>
    )
}