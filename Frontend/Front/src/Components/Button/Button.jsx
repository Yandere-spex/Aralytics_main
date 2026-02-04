import './Button.css';



export default function Button({ 
    children, 
    onClick, 
    type = '',
    disabled = false,
    width = 'auto',
    style,  
    }) 
    
    {
    return (
        <button
        type={type}
        className={style ? 'btnFillLeftRed' : 'btnFillLeft'}
        onClick={onClick}
        disabled={disabled}
        style={{ width: width }}
        >
        {children}
        </button>
    );
};

