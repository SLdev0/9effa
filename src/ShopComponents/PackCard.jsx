import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import SideMenu from './SideMenu';
import { Button } from "@/components/ui/button"
import { Cross1Icon } from '@radix-ui/react-icons';
export default function PackCard(props) {
    const [packsInCarts, setPacksInCarts] = useState([])

    useEffect(() => {
        setPacksInCarts(JSON.parse(sessionStorage.getItem('CartItems')) || []);

        // Add event listener for 'removedFromCart' event here
        window.addEventListener("removedFromCartEvent", RemovedFromCartFunction);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("removedFromCartEvent", RemovedFromCartFunction);
        };

    }, []);

    function RemovedFromCartFunction() {
        setPacksInCarts(JSON.parse(sessionStorage.getItem('CartItems')) || []);
    }

    // Bafore Remove from cart function
    function handleClickRemove(id) {
        RemoveFromCart(id);
    }

    // call Remove From cart funcion in Cart Component using CustomEvent
    function RemoveFromCart(p_id) {
        var event = new CustomEvent("removeItemFromCartEvent", { detail: { id: p_id } });
        window.dispatchEvent(event);
    }

    return (
        <Card className="w-full grid">
            <CardHeader>
                <img className='pImage rounded-t-xl w-auto object-contain aspect-square' src={props.imageUrl} alt={props.name} />
            </CardHeader>
            <CardContent>
                <h2 className='font-bold text-xl'>{props.name} </h2>
                <p>{props.desc}</p>
            </CardContent>
            <CardFooter className="flex w-full justify-between items-center pb-3">
                <p className='font-bold text-lg'>{props.price}.د.م</p>
                {packsInCarts.some((el) => el.id == props.id) ? (
                    <Button data-value={props.id} onClick={(e) => { handleClickRemove(props.id) }} className="after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative bg-red-400 !rounded-full p-2 aspect-square hover:bg-red-400/70 focus:bg-red-400/90 w-[31px] h-[31px]">
                        <Cross1Icon className='text-white add_icon' />
                    </Button>
                ) : (
                    <SideMenu source='Pack' p_id={props.id} />
                )}
            </CardFooter>
        </Card>
    )
}
