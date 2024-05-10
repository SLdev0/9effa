import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusIcon } from '@radix-ui/react-icons'
import { v4 as uuidv4 } from 'uuid';
import GroceryPCard from './GroceryPCard'
import AdditionalPCard from './AdditionalPCard'

export default function SideMenu(props) {
    const { source } = props;
    const { p_id } = props;
    const [fruits, setFruits] = useState([]);
    const [vegetables, setVegetables] = useState([]);
    const [bio, setBio] = useState([]);
    const [Allproducts, setAllproducts] = useState([]);
    const [PreparedV, setPreparedV] = useState([]);
    const [PackDetails, setPackDetails] = useState({});
    const [CartExtraProducts, setCartExtraProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Checks if Product in cart or not to toggle add/emove cart buttons 
    function RemovedFromCartFunction(event) {
        if (event.detail.id === p_id) {
            // remove emove from cart btn
            const RemoveFromCartBtn = document.querySelector(`.RemoveFromCartBtn[data-value="${event.detail}"]`);
            if (RemoveFromCartBtn) {
                RemoveFromCartBtn.remove()
            }
        }
    }
    useEffect(() => {
        // Add event listener for 'removedFromCart' event
        window.addEventListener("removedFromCartEvent", RemovedFromCartFunction);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("removedFromCartEvent", RemovedFromCartFunction);
        };
    }, [])

    // Function to check if all session data is available
    useEffect(() => {
        const checkSessionData = () => {
            const localFruits = JSON.parse(sessionStorage.getItem('localfruits'));
            const localVegetables = JSON.parse(sessionStorage.getItem('localVegetables'));
            const localBio = JSON.parse(sessionStorage.getItem('localbio'));
            const localPreparedV = JSON.parse(sessionStorage.getItem('localPreparedV'));
            const allTempProducts = JSON.parse(sessionStorage.getItem('products'));
            if (localFruits && localVegetables && localBio && localPreparedV && allTempProducts) {
                setFruits(localFruits);
                setVegetables(localVegetables);
                setBio(localBio);
                setPreparedV(localPreparedV);
                setAllproducts(allTempProducts);

            }
            else {
                // Retry after a short delay
                setTimeout(checkSessionData, 100);
            }
        };
        checkSessionData();
    }, []);

    // Display the pack name and price in the top side sidebar menu if available
    function ShowPack(id, source) {
        setIsLoading(true);
        if (source == "headerParent") {
            const storedCartProducts = JSON.parse(sessionStorage.getItem('CartItems'));
            if (storedCartProducts) {
                storedCartProducts.forEach(cData => {
                    if (cData.type === "Pack") {
                        const packId = cData.id;
                        Allproducts.forEach(pData => {
                            if (pData.id === packId) {
                                setPackDetails(pData);
                                setIsLoading(false);
                            }
                        })
                    }
                })
            }
        } else {
            Allproducts.forEach(pData => {
                if (pData.id === id) {
                    setPackDetails(pData);
                    setIsLoading(false);
                }
            })
        }
    }

    // Bafore Add to cart function
    function handleClick(p_id, type, source, e) {
        ShowPack(p_id, source);
        if (source !== "headerParent") {
            AddToCart(p_id, type);
            addElementCoveringExisting(e.target)
        }
    }

    // call add to cart funcion in Cart Component using CustomEvent
    function AddToCart(p_id, type) {
        var event = new CustomEvent("AddToCartEvent", { detail: { id: p_id, type: type } });
        window.dispatchEvent(event);
    }

    function addElementCoveringExisting(element) {
        const existingElement = element
        const rect = existingElement.getBoundingClientRect();
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newElement = document.createElement("div");
        newElement.style.position = "absolute";
        newElement.style.top = rect.top + scrollTop + "px";
        newElement.style.left = rect.left + scrollLeft + "px";
        newElement.style.width = rect.width + "px";
        newElement.style.height = rect.height + "px";
        newElement.setAttribute('data-value', existingElement.getAttribute('data-id'));
        newElement.onclick = () => { handleClickRemove(existingElement.getAttribute('data-id'), source) };
        const classes = ['RemoveFromCartBtn', '!z-50', 'rounded-full', 'bg-red-400', 'hover:bg-[#fa9b9b]', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'after:w-full', 'after:h-full', 'after:absolute', 'after:inset-0', 'after:bg-transparent', 'after:!rounded-full'];
        classes.forEach(className => {
            newElement.classList.add(className);
        });
        newElement.innerHTML = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white add_icon"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`
        existingElement.parentNode.insertBefore(newElement, existingElement);
        return newElement;
    }

    // Bafore Remove from cart function
    function handleClickRemove(p_id, source) {
        if (source !== "headerParent") {
            RemoveFromCart(p_id);
        }
    }

    // call Remove From cart funcion in Cart Component using CustomEvent
    function RemoveFromCart(p_id) {
        var event = new CustomEvent("removeItemFromCartEvent", { detail: { id: p_id } });
        window.dispatchEvent(event);
    }

    // Show/hide ScrollBar
    function addScrollBar(el) {
        el.classList.add('custom_Scrollbar', 'pr-4');
        el.classList.remove('no-scrollbar');
    }
    function removeScrollBar(el) {
        el.classList.remove('custom_Scrollbar', 'pr-4');
        el.classList.add('no-scrollbar');
    }

    // Show Prices of item i add in prices section ni bottom
    window.addEventListener("AddToCartEvent", AddToCartEventFunction);
    window.addEventListener("removedFromCartEvent", AddToCartEventFunction);

    function AddToCartEventFunction() {
        setCartExtraProducts([]);
        const cartItems = JSON.parse(sessionStorage.getItem('CartItems'));
        if(cartItems){
            let tempData = [];
            cartItems.forEach(cartItem => {
                Allproducts.forEach(pData => {
                    if (pData.id === cartItem.id && cartItem.type !== 'Pack') {
                        tempData.push(pData.price);
                    }
                });
            });
            setCartExtraProducts(tempData);
        }
    }



    const className = source == 'headerParent' ? 'z-10 bg-green p-2 after:w-full after:h-full after:absolute after:inset-0 relative' : 'z-10 bg-black !rounded-full p-2 after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative';
    return (
        <Sheet side="left">
            <SheetTrigger
                className={className}
                data-id={p_id}
                onClick={(e) => { handleClick(p_id, 'Pack', source, e) }}
                aria-label="Open Menu"
            >
                {source !== 'headerParent' ? (
                    <PlusIcon className='text-white' />
                ) : (
                    <svg viewBox="0 0 24 24" width='28' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Menu_Alt_05"> <path id="Vector" d="M5 17H13M5 12H19M11 7H19" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
                )}
            </SheetTrigger>
            <SheetContent side="left" className='p-0'>
                <SheetHeader className='text-center sm:text-left h-full grid grid-rows-12 items-stretch flex-row p-0 lg:flex'>
                    <SheetTitle className="lg:w-2/3 pt-14 grid grid-rows-12 grid-cols-1 row-span-6 w-full">
                        <div className={`${isLoading ? 'hidden' : 'row-span-4'} lg:px-4 px-2`}>
                            {isLoading ? (
                                <p className='space-y-2'>
                                    <Skeleton className="w-[65%] h-[30px]" />
                                    <Skeleton className="w-[35%] h-[30px]" />
                                </p>
                            ) : (
                                // PackDetails is coming from woocommerce api for get all products
                                <div className='max-h-full overflow-y-scroll no-scrollbar transition-all' onMouseOver={(e) => { addScrollBar(e.currentTarget) }} onMouseLeave={(e) => { removeScrollBar(e.currentTarget) }}>
                                    <h2 className='font-bold text-xl'>{PackDetails.name}</h2>
                                    <p className='font-bold text-lg'>{PackDetails.price}.د.م</p>
                                    <hr className='my-1' />
                                    <div className='text-base font-normal pack_Description' dangerouslySetInnerHTML={{ __html: PackDetails.description }} />
                                </div>
                            )}
                        </div>
                        <div className={`row-span-${isLoading ? '10' : '6'} overflow-y-scroll no-scrollbar pb-4 relative pl-2 lg:pl-4 px-4 pt-0 ${isLoading ? '' : ' mt-12 md:!mt-6  lg:!mt-6'}`} onMouseOver={(e) => { addScrollBar(e.currentTarget) }} onMouseLeave={(e) => { removeScrollBar(e.currentTarget) }}>
                            <Accordion collapsible defaultValue="item-1" className='my_shop relative'>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>les légumes</AccordionTrigger>
                                    <AccordionContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 pt-2">
                                        {vegetables.map((veget, index) => (
                                            <GroceryPCard key={uuidv4()} Pid={veget.id} variations={veget.variations} typee="Légumes" imageUrl={veget.images[0].src} name={veget.name} price={veget.price} />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>les fruits</AccordionTrigger>
                                    <AccordionContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 pt-2">
                                        {fruits.map((Fruit, index) => (
                                            <GroceryPCard key={uuidv4()} variations={Fruit.variations} Pid={Fruit.id} typee="Fruits" imageUrl={Fruit.images[0].src} name={Fruit.name} price={Fruit.price} />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className='row-span-1 border-t p-6 py-12 hidden lg:flex items-center justify-between'>
                            <div className='grid gap-2'>
                                {isLoading ? (
                                    <p>
                                    </p>
                                ) : (
                                    <span className='font-bold text-lg'>{PackDetails.price}.د.م</span>
                                )}
                                <div className='text-green-600'>
                                    {/* Calculate the total price */}
                                    + {CartExtraProducts.reduce((total, exPrice) => total + parseFloat(exPrice), 0)} د.م
                                </div>

                            </div>

                            <Button aria-label="AJOUTER AU PANIER" variant="outline" className=" text-green-600 border-green-600 hover:border-green-700 hover:text-green-700">AJOUTER AU PANIER</Button>

                        </div>
                    </SheetTitle>
                    <SheetDescription className="lg:w-1/3 bg-gray-100 px-6 pt-2 lg:pt-14 !mt-0 flex flex-col pb-1 lg:pb-6 row-span-6 w-full">
                        <h2 className='font-bold text-xl mb-4'>Vous pouvez également être intéressé par</h2>
                        <div className='h-full self-stretch max-h-full overflow-y-scroll no-scrollbar custom_Scrollbar lg:space-y-4 grid grid-cols-2 gap-4 lg:block'>
                            {
                                bio.map((bioItem) => (
                                    <AdditionalPCard key={uuidv4()} isInCart={bioItem.isInCart} className="additionalItems" Pid={bioItem.id} variations={bioItem.variations} typee="bio" imageUrl={bioItem.images[0].src} name={bioItem.name} price={bioItem.price} />
                                ))
                            }
                            {
                                PreparedV.map((PreparedVItem) => (
                                    <AdditionalPCard key={uuidv4()} isInCart={PreparedVItem.isInCart} className="additionalItems" Pid={PreparedVItem.id} variations={PreparedVItem.variations} typee="PreparedV" imageUrl={PreparedVItem.images[0].src} name={PreparedVItem.name} price={PreparedVItem.price} />
                                ))
                            }
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
