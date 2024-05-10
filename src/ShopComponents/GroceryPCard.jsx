import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
export default function GroceryPCard(props) {


    useEffect(() => {
        const checkSessionData = () => {
            const storedCartProducts = JSON.parse(sessionStorage.getItem('CartItems'));

            if (storedCartProducts) {
                // check if products in the cart and show them
                const elements = document.querySelectorAll('.Grcard');
                elements.forEach(element => {
                    const dataId = element.getAttribute('data-id');
                    const inputElement = element.querySelector('input[type="checkbox"]');
                    storedCartProducts.forEach(product => {
                        const dataIdNumber = parseInt(dataId);
                        if (dataIdNumber === product.id) {
                            element.classList.add('seleted', 'shadow-2xl', 'transform', '-translate-y-2');
                            inputElement.checked = true;
                        }
                    });
                });
            } else {
                // Retry after a short delay
                setTimeout(checkSessionData, 100); // the delay
            }
        };

        checkSessionData(); // Initial call
    }, []);

    function AddGrToCart(e, p_id, type) {
        const element = e.currentTarget
        if (element.classList.contains("seleted")) {
            element.classList.remove('shadow-2xl', 'seleted', 'transform', '-translate-y-2');
            const inputElement = element.querySelector('input[type="checkbox"]');
            if (inputElement) {
                inputElement.checked = false;
                var event = new CustomEvent("removeItemFromCartEvent", { detail: { id: p_id } });
                window.dispatchEvent(event);
            }
        } else {
            element.classList.add('seleted', 'shadow-2xl', 'transform', '-translate-y-2');
            const inputElement = element.querySelector('input[type="checkbox"]');
            if (inputElement) {
                inputElement.checked = true;
                var event = new CustomEvent("AddToCartEvent", { detail: { id: p_id, type: type } });
                window.dispatchEvent(event);
            }
        }
    }

    return (
        <Card className='transition-all  flex flex-col justify-between cursor-pointer Grcard' data-type={props.typee} data-id={props.Pid} onClick={(e) => { AddGrToCart(e, props.Pid, props.typee) }}>
            <CardHeader >
                <img src={props.imageUrl} alt="" className='pImage rounded-t-xl w-full aspect-[1.5] object-contain' />
            </CardHeader>
            <CardContent className="p-2">
                <h2 className='font-bold text-xl'>{props.name} </h2>
                <p>{props.desc}</p>
                <span>{props.variations}</span>
            </CardContent>
            <CardFooter className=" row-span-2 p-2 rounded-tl-none rounded-tr-none bg-gray-100 flex items-center justify-between">
                <p className='font-bold text-lg'>{props.price}.د.م</p>
                <div className="inline-flex items-center">
                    <label className="relative flex items-center p-3 rounded-full cursor-pointer">
                        <input type="checkbox" name={`${props.typee}_${props.id}`} value={props.id}
                            className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-900/20 bg-gray-900/10 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:scale-105 hover:before:opacity-0" />
                        <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1"> <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> </span>
                    </label>
                </div>
            </CardFooter>
        </Card>
    )
}
