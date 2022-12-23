const Notification = ({errorMessage}) => {
    if (errorMessage.text === null){
        return null
    }
    
    const notificationStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (!errorMessage.positive){
        notificationStyle.color = 'red'
    }
    

    return(
        <div style={notificationStyle}>
            {errorMessage.text}
        </div>
    )
}

export default Notification