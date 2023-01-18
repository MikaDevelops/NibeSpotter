export default function getData(){
    const apiUrl = "https://www.nordpoolgroup.com/api/marketdata/page/35?currency=EUR";

    fetch( apiUrl )
    .then ( ( response )=> { return response.json(); } )

} 

