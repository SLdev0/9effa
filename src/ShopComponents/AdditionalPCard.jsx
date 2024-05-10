import React, { useEffect, useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Cross1Icon } from '@radix-ui/react-icons';
import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button"
export default function AdditionalPCard(props) {

    useEffect(() => {
        // console.log('text')
        const checkSessionData = () => {
            // console.log('text checkSessionData')
            const storedCartProducts = JSON.parse(sessionStorage.getItem('CartItems'));

            if (storedCartProducts) {
                // check if products in the cart and show them
                const elements = document.querySelectorAll('.additionalItems');
                elements.forEach(element => {
                    const dataId = element.getAttribute('data-id');
                    const AdddBtn = element.querySelector('button.AdddBtn');
                    const RemoveBtn = element.querySelector('button.RemoveBtn');
                    let exists = false;
                    storedCartProducts.forEach(product => {
                        const dataIdNumber = parseInt(dataId);
                        if (dataIdNumber === product.id) {
                            exists=true;
                        }
                    });
                    if(exists){
                        AdddBtn.classList.add('hidden');
                        AdddBtn.classList.remove('flex');
                        RemoveBtn.classList.remove('hidden');
                        RemoveBtn.classList.add('flex');
                    }
                    else{
                        RemoveBtn.classList.add('hidden');
                        RemoveBtn.classList.remove('flex');
                        AdddBtn.classList.remove('hidden');
                        AdddBtn.classList.add('flex');
                    }
                });
            } else {
                // Retry after a short delay
                setTimeout(checkSessionData, 100); // the delay
            }
        };

        checkSessionData(); // Initial call
    }, []);

    // call Remove From cart funcion in Cart Component using CustomEvent
    function RemoveFromCartAddt(el, p_id) {
        var event = new CustomEvent("removeItemFromCartEvent", { detail: { id: p_id } });
        window.dispatchEvent(event);
        const AdddBtn = document.querySelector(`button.AdddBtn[data-value="${p_id}"]`)
        if (AdddBtn) {
            AdddBtn.classList.remove('hidden');
            AdddBtn.classList.add('flex');
            el.classList.add('hidden');
            el.classList.remove('flex');
        }

    }

    // call add to cart funcion in Cart Component using CustomEvent
    function AddToCartAddt(el, p_id, type) {
        var event = new CustomEvent("AddToCartEvent", { detail: { id: p_id, type: type } });
        window.dispatchEvent(event);
        const removeBtn = document.querySelector(`button.RemoveBtn[data-value="${p_id}"]`)
        if (removeBtn) {
            removeBtn.classList.remove('hidden');
            removeBtn.classList.add('flex');
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    }

    return (
        <Card className="w-full additionalItems" data-id={props.Pid}>
            <CardHeader>
                <img className='pImage rounded-t-xl select-none w-full aspect-square object-cover mb-4 lg:mb-0' src={props.imageUrl} alt={props.name + " Image"} />
            </CardHeader>
            <CardContent>
                <b className='font-bold text-xl'>{props.name} </b>
                <span>{props.desc}</span>
                <span>{props.isInCart}</span>
                <span>{props.variations}</span>
            </CardContent>
            <CardFooter className="flex w-full justify-between items-center">
                <span className='font-bold text-lg'>{props.price}.د.م</span>
                {/* add to cart */}
                <Button data-value={props.Pid} onClick={(e) => { AddToCartAddt(e.currentTarget, props.Pid, props.typee) }} className="items-center justify-center flex AdddBtn after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative bg-primary !rounded-full p-2 aspect-square focus:bg-primary/90">
                    <PlusIcon className='text-white add_icon' />
                </Button>
                {/* remove to cart */}
                <Button data-value={props.Pid} onClick={(e) => { RemoveFromCartAddt(e.currentTarget, props.Pid) }} className="items-center justify-center RemoveBtn hidden after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative bg-red-400 !rounded-full p-2 aspect-square hover:bg-red-400/70 focus:bg-red-400/90">
                    <Cross1Icon className='text-white add_icon' />
                </Button>
            </CardFooter>
        </Card>
    )
}
