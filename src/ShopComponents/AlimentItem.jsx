import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cross1Icon } from '@radix-ui/react-icons';

export default function AlimentItem({ al, onAddToCart, onRemoveFromCart, isInCart,qnt }) {
    const [quantityValue, setQuantityValue] = useState(1);

    const handleInputChange = (event) => {
        let inputVal = parseFloat(event.target.value);
        const decimalPart = inputVal % 1; // Get the decimal part of the number
        if (decimalPart !== 0.5 && decimalPart !== 0) {
            inputVal = Math.floor(inputVal); // Round down to the nearest whole number if not ending in .5
        }
        const minVal = 0.5;
        setQuantityValue(Math.max(minVal, inputVal));
    };

    // add 0.5 to quantity value
    function increase() {
        setQuantityValue(prevQuantity => {
            const newQuantity = prevQuantity + 0.5;
            if (isInCart) {
                var event = new CustomEvent("AddToCartEvent", { detail: { id: al.id, type: al.type, qnt: newQuantity } });
                window.dispatchEvent(event);
            }
            return newQuantity;
        });
    }
    // remove 0.5 from quantity value
    function decrease() {
        setQuantityValue(prevQuantity => {
            const newQuantity = prevQuantity - 0.5;
            const minVal = 0.5;
            if (isInCart) {
                var event = new CustomEvent("AddToCartEvent", { detail: { id: al.id, type: al.type, qnt: Math.max(minVal, newQuantity) } });
                window.dispatchEvent(event);
            }
            return Math.max(minVal, newQuantity);
        });
    }

    // set qunatity to 1 if item is not in cart
    useEffect(() => {
        if (!isInCart) {
            setQuantityValue(1);
        }else{
            setQuantityValue(qnt);
        }
    }, [isInCart]);

    return (
        <Card className="w-full grid rounded-2xl">
            <CardHeader>
                <img className='pImage rounded-t-xl w-[70%] mx-auto object-contain aspect-square' src={al.images[0].src} alt={al.name} />
            </CardHeader>
            <CardContent className='px-3 -mb-4'>
                <h2 className='font-bold text-xl'>{al.name}</h2>
                {/* <small className='text-gray-400'>1kg</small> */}
            </CardContent>
            <CardFooter className="w-full pb-2 px-3 rounded-2xl grid">
                <p className='font-bold text-lg'>{al.price}.د.م</p>
                <div className='flex w-full justify-between items-center mt-2'>
                    <div className='border flex justify-between items-center rounded-full w-[60%]'>
                        <Button variant="outline" className='rounded-full aspect-square border-0' onClick={decrease}>-</Button>
                        <input type="text" value={quantityValue} onChange={handleInputChange} className='pl-[3px] w-full max-w-full !outline-0 focus-visible:!outline-0' />
                        <Button variant="outline" className='rounded-full aspect-square border-0' onClick={increase}>+</Button>
                    </div>
                    {/* Implement the logic for Add/Remove button based on your existing logic */}
                    {isInCart ? (
                        <Button data-value={al.id} onClick={() => onRemoveFromCart(al.id)} className="after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative bg-red-400 !rounded-full p-2 aspect-square hover:bg-red-400/70 focus:bg-red-400/90 w-[31px] h-[31px]">
                            <Cross1Icon className='text-white add_icon' />
                        </Button>
                    ) : (
                        <Button data-value={al.id} onClick={() => onAddToCart(al.id, quantityValue)} className="after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative bg-primary !rounded-full p-2 aspect-square hover:bg-primary/70 focus:bg-primary/90 w-[31px] h-[31px]">
                            <Cross1Icon className='text-white add_icon transform rotate-45' />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}