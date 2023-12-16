const Alert = (props) => {
    if (props.tokenValid) {
        return (
            <div className='alert'>
                System is running and token is valid.
            </div>
        );
    }else {
        return (
            <div className='alert'>
                Token is not valid! <br />
                Please log in at <a href="http://localhost:3001">localhost</a>
            </div>
        );
    }
}

export default Alert;