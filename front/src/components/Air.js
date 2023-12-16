const Air = (props)=>{

    return(

        <div>
            Supply air temperature: {props.airSupplyTemp} <br/>
            Extract air temperature: {props.airExtractTemp} <br/>
            Exhaust air temperature: {props.airExhaustTemp} <br/>
            Fan speed: {props.fanSpeed}
        </div>

    );

}

export default Air