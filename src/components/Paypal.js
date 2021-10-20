import React,{useRef,useEffect} from 'react'

export default function Paypal(props) {
    const paypal = useRef()

    useEffect(()=>{

        window.paypal.Buttons({
            createOrder:(data,actions,err)=>{
                return actions.order.create({
                    intent:"CAPTURE",
                    purchase_units:[
                        {
                            description:"Mãi bên nhau bạn nhé",
                            amount:{
                                currency_code:"USD",
                                value:props.tongtien
                            }
                        }
                    ]
                })
            },
            onApprove:async (data,actions)=>{
                const order = await actions.order.capture()
                console.log(order);
                props.paymentStatus(true);
            },
            onError: (err)=>{
                console.log(err)
                props.paymentStatus(false);
            }
        }).render(paypal.current)
    },[])
    return (
        <div>
            <div ref={paypal}></div>
        </div>
    )
}
