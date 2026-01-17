import InputComponent from "../../../InputComponent/InputComponent"

export default function Login() {
    return(
        <>
            <div className="main-wrapper">
                <InputComponent type={"text"} placeholder={"Hello World"} id={'inputEmail'} />
            </div>
        </>
    )
}