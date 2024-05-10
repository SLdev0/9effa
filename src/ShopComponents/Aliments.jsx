import React, { useEffect, useRef, useState } from 'react';
import PackCard from './PackCard';
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cross1Icon } from '@radix-ui/react-icons';
import { Input } from "@/components/ui/input"
import AlimentItem from './AlimentItem';

export default function Aliments() {
    const [packsInCarts, setPacksInCarts] = useState([])
    const [qunatityValue, setQunatityValue] = useState('');
    const { type } = useParams();
    let catID = 80
    if (type === 'Fruits') {
        catID = 80;
    } else if (type === 'Légumes') {
        catID = 81;
    }

    const consumerKey = 'ck_80cd7e4357e0152a6a74f2fea3ed5d2b098d5849';
    const consumerSecret = 'cs_e1a55ae4cbb74f3cb7386dab643401c6086f4ded';
    const baseUrl = 'https://client.lahza.ma/wp-json/wc/v3/products';
    const [aliments, setAliments] = useState([]);
    const [done, setDone] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchCategory = async () => {
            const basicAuth = btoa(`${consumerKey}:${consumerSecret}`);
            const headers = {
                'Authorization': `Basic ${basicAuth}`,
            };
            let products = [];
            let page = 1;
            let isFetching = true;

            while (isFetching) {
                const response = await fetch(`${baseUrl}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&category=${catID}&per_page=100&page=${page}`, { headers });

                if (!response.ok) {
                    throw new Error(`Error fetching products: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.length) {
                    products = products.concat(data);
                    page++;
                } else {
                    isFetching = false;
                }
            }

            sessionStorage.setItem(`local${catID}`, JSON.stringify(products));
            setAliments(products);
            setDone(true);
        };

        const localData = sessionStorage.getItem(`local${catID}`);
        if (localData) {
            setAliments(JSON.parse(localData));
            setDone(true);
        } else {
            fetchCategory();
        }
    }, [type]);

    // code that checks if item in cart or not and toggle button of add / remove to/ from cart
    useEffect(() => {
        setPacksInCarts(JSON.parse(sessionStorage.getItem('CartItems')) || []);

        // Add event listener for 'removedFromCart' event here
        window.addEventListener("removedFromCartEvent", EventFunction);
        window.addEventListener("AddToCartEvent", EventFunction);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("removedFromCartEvent", EventFunction);
            window.addEventListener("AddToCartEvent", EventFunction);
        };

    }, []);
    function EventFunction() {
        setPacksInCarts(JSON.parse(sessionStorage.getItem('CartItems')) || []);
    }

    // RemoveFromCart
    function RemoveFromCart(id) {
        var event = new CustomEvent("removeItemFromCartEvent", { detail: { id: id } });
        window.dispatchEvent(event);
    }

    // call add to cart funcion in Cart Component using CustomEvent
    function AddToCart(p_id, quantity) {
        var event = new CustomEvent("AddToCartEvent", { detail: { id: p_id, type: type, qnt: quantity } });
        window.dispatchEvent(event);
    }

    const handleInputChange = (event) => {

        setQunatityValue(event.target.value);

    };

    return (
        <div className='w-full py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-8 gap-5 packs px-0'>
            {!done && Array.from({ length: 8 }, (_, i) => (
                <div className="flex flex-col space-y-3" key={i}>
                    <Skeleton className="w-full rounded-xl aspect-square" />
                    <div className="space-y-4 p-2">
                        <Skeleton className="h-6 w-2/3" />
                        <div className='flex w-full justify-between items-center'>
                            <Skeleton className="h-6 w-[70px]" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
            {done && (
                <>
                    {/* {aliments.map((al) => (

                        <Card className="w-full grid rounded-2xl" key={`fruit_${al.id}`} >
                            <CardHeader>
                                <img className='pImage rounded-t-xl w-[70%] mx-auto object-contain aspect-square' src={al.images[0].src} alt={al.name} />
                            </CardHeader>
                            <CardContent className='px-3 -mb-4'>
                                <h2 className='font-bold text-xl'>{al.name} </h2>
                                <small className='text-gray-400'>1kg</small>
                            </CardContent>
                            <CardFooter className="w-full pb-2 px-3 rounded-2xl grid">
                                <p className='font-bold text-lg'>{al.price}.د.م</p>
                                <div className='flex w-full justify-between items-center'>
                                    <div className='rounded-full border'>
                                        <input type="text" value={qunatityValue} onChange={handleInputChange} />                                    </div>
                                    {packsInCarts.some((el) => el.id == al.id) ? (
                                        <Button data-value={al.id} onClick={(e) => { RemoveFromCart(al.id) }} className="after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative bg-red-400 !rounded-full p-2 aspect-square hover:bg-red-400/70 focus:bg-red-400/90 w-[31px] h-[31px]">
                                            <Cross1Icon className='text-white add_icon' />
                                        </Button>
                                    ) : (
                                        <Button data-value={al.id} onClick={(e) => { AddToCart(al.id) }} className="after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative bg-primary !rounded-full p-2 aspect-square hover:bg-primary/70 focus:bg-primary/90 w-[31px] h-[31px]">
                                            <Cross1Icon className='text-white add_icon transform rotate-45' />
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))} */}
                    {aliments.map((al) => {
                        const cartItem = packsInCarts.find(item => item.id === al.id);
                        const itemQuantity = cartItem ? cartItem.quantity : 1;
                        return (
                            <AlimentItem
                                key={`aliment_${al.id}`}
                                al={al}
                                onAddToCart={(id, quantity) => AddToCart(id, quantity)}
                                onRemoveFromCart={(id) => RemoveFromCart(id)}
                                isInCart={!!cartItem}
                                qnt={itemQuantity}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
}