import React, { useEffect, useState, useRef } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Cross1Icon } from '@radix-ui/react-icons'
import { Separator } from "@/components/ui/separator"

export default function Cart() {
    const cartDropDownRef = useRef(null);
    const [cartProducts, setCartProducts] = useState([]);
    const [Allproducts, setAllproducts] = useState([]);
    const [cartProductsData, setCartProductsData] = useState([]);
    const [isItemInCart, setisItemInCart] = useState(false);
    let [TotalPrice, setTotalPrice] = useState(0);

    // update session storage
    useEffect(() => {
        const handleStorageChange = () => {
            const cartItems = JSON.parse(sessionStorage.getItem('CartItems')) || [];
            setCartProducts(cartItems);
            const allTempProducts = JSON.parse(sessionStorage.getItem('products'));
            setAllproducts(allTempProducts);
            let zero = 0;
            setTotalPrice(zero);
            console.log(cartItems)
        };

        // event listeners for multiple events
        window.addEventListener('removedFromCartEvent', handleStorageChange);
        window.addEventListener('AddToCartEvent', handleStorageChange);

        handleStorageChange(); // Initial call to handle storage change

        return () => {
            // Remove event listeners for multiple events
            window.removeEventListener('removedFromCartEvent', handleStorageChange);
            window.removeEventListener('AddToCartEvent', handleStorageChange);
        };
    }, [])


    useEffect(() => {
        if (cartProducts) {
            const cartTempProductsData = cartProducts.map((productCart) => {
                const product = Allproducts.find((p) => p.id == productCart.id);
                if (!product) return null; // Handle case where product is not found
                return {
                    ...product,
                    quantity: productCart.quantity
                };
            }).filter(product => product !== null);
            setCartProductsData(cartTempProductsData)
            cartTempProductsData.map((el) => {
                // let temp = Number(el.price);
                let temp = Number(el.price*el.quantity);
                setTotalPrice(TotalPrice += temp);
            })
            setisItemInCart(true)
        }

    }, [cartProducts, Allproducts]);


    // add to cart
    function AddToCart(event) {
        const id = event.detail.id;
        const type = event.detail.type;
        const qnt = event.detail.qnt;
        let CartItems = sessionStorage.getItem('CartItems');
        let items = [];

        if (CartItems !== null) {
            try {
                items = JSON.parse(CartItems);
            } catch (error) {
                console.error('Error parsing sessionStorage data:', error);
            }
        }

        // Step 1: Check if item already exists in cart by id
        const existingItemById = items.some(cartItem => cartItem.id === id);

        if (existingItemById) {
            // If item exists by id, checks  if(qnt) then update quanity in cart to qnt and   if(!qnt) do nothing
            if (qnt) {
                items.forEach(cartItem => {
                    if (cartItem.id === id) {
                        cartItem.quantity = qnt;
                    }
                });
                sessionStorage.setItem('CartItems', JSON.stringify(items));
                window.dispatchEvent(new Event("PAddedToCartEvent"));
            }
            return; // Exit the function early
        }

        // Step 2: If item does not exist by id, check if it's of type 'pack'
        if (type === 'Pack') {
            // Check if item of type 'pack' already exists in cart
            const existingPackItem = items.some(cartItem => cartItem.type === 'Pack');

            if (existingPackItem) {
                // If item of type 'pack' exists, remove the existing 'pack' item before adding the new one
                const PackInCart = items.filter(cartItem => cartItem.type === 'Pack');
                items = items.filter(cartItem => cartItem.type !== 'Pack');
                const packItemIds = PackInCart.map((item) => item.id);
                var event = new CustomEvent("removeItemFromCartEvent", { detail: { id: packItemIds } });
                window.dispatchEvent(event);
            }
        }

        // Step 3: Add the item to the cart
        if (qnt) {
            items.push({ id: id, type: type, quantity: qnt });
        } else {
            items.push({ id: id, type: type, quantity: 1 });
        }
        sessionStorage.setItem('CartItems', JSON.stringify(items));
        window.dispatchEvent(new Event("PAddedToCartEvent"));

        cartDropDownRef.current.classList.remove("translate-y-[-158%]")
    }

    // event listener to 'window' listening for the 'AddToCartEvent' event
    window.addEventListener("AddToCartEvent", AddToCart);

    // remove from cart
    function RemoveFromCart(id) {
        let items = [];
        if (sessionStorage.getItem('CartItems')) {
            try {
                items = JSON.parse(sessionStorage.getItem('CartItems'));
            } catch (e) {
                console.log("Error parsing JSON: ", e);
            }
        }
        let found = false;
        items.forEach((item, index) => {
            if (item.id === id) {
                found = true;
                if (item.quantity > 1) {
                    items[index].quantity = item.quantity - 1;
                } else {
                    items.splice(index, 1);
                }
            }
        });
        if (found) {
            sessionStorage.setItem('CartItems', JSON.stringify(items));
        }

        // Add an event listener to 'window' listening for the 'session' event
        const removedFromCartEvent = new CustomEvent('removedFromCartEvent', { detail: id });
        window.dispatchEvent(removedFromCartEvent);
    }

    function BeforeRemoveFromCart(event) {
        const id = parseInt(event.detail.id);
        RemoveFromCart(id)
    }

    // event listener to 'window' listening for the 'removedFromCartById' event
    window.addEventListener("removeItemFromCartEvent", BeforeRemoveFromCart);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartDropDownRef.current && !cartDropDownRef.current.contains(event.target)) {
                cartDropDownRef.current.classList.add("translate-y-[-158%]");
            }
        };

        const handleScroll = () => {
            if (cartDropDownRef.current) {
                cartDropDownRef.current.classList.add("translate-y-[-158%]");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    function Payment() {
        // Array of URLs to execute
        const cartItems = JSON.parse(sessionStorage.getItem('CartItems'));
        const urls = []
        cartItems.map((item) => {
            urls.push(`https://client.lahza.ma/paiement/?add-to-cart=${item.id}&quantity=${item.quantity}`);
        });
        addToCartAndProceed(urls);
    }
    async function addToCartAndProceed(urls) {
        try {
            // Array to hold all fetch promises
            const fetchPromises = [];

            // Iterate through each URL and send a fetch request
            for (const url of urls) {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to add to cart: ${response.statusText}`);
                }
                fetchPromises.push(response);
            }

            // Wait for all fetch requests to complete
            await Promise.all(fetchPromises);

            // Once all requests are complete, redirect to the final URL
            window.location.href = 'https://client.lahza.ma/paiement';
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <Sheet>
            <aside ref={cartDropDownRef} onClick={(e) => e.stopPropagation()} className='fixed right-0 p-4 shadow-2xl bg-white border rounded-lg z-50 top-[7%] transition-all duration-500 ease-in-out translate-y-[-158%]' id='CartDropDown'>
                <span className="flex items-center w-full justify-between m-0 p-0">
                    <small className="flex items-bottom gap-1 justify-between">
                        <svg width="16px" height="16px" viewBox="0 0 1024 1024" fill="#3e424a" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.71"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M800.8 952c-31.2 0-56-24.8-56-56s24.8-56 56-56 56 24.8 56 56-25.6 56-56 56z m-448 0c-31.2 0-56-24.8-56-56s24.8-56 56-56 56 24.8 56 56-25.6 56-56 56zM344 792c-42.4 0-79.2-33.6-84-76l-54.4-382.4-31.2-178.4c-2.4-19.2-19.2-35.2-37.6-35.2H96c-13.6 0-24-10.4-24-24s10.4-24 24-24h40.8c42.4 0 80 33.6 85.6 76l31.2 178.4 54.4 383.2C309.6 728 326.4 744 344 744h520c13.6 0 24 10.4 24 24s-10.4 24-24 24H344z m40-128c-12.8 0-23.2-9.6-24-22.4-0.8-6.4 1.6-12.8 5.6-17.6s10.4-8 16-8l434.4-32c19.2 0 36-15.2 38.4-33.6l50.4-288c1.6-13.6-2.4-28-10.4-36.8-5.6-6.4-12.8-9.6-21.6-9.6H320c-13.6 0-24-10.4-24-24s10.4-24 24-24h554.4c22.4 0 42.4 9.6 57.6 25.6 16.8 19.2 24.8 47.2 21.6 75.2l-50.4 288c-4.8 41.6-42.4 74.4-84 74.4l-432 32c-1.6 0.8-2.4 0.8-3.2 0.8z" fill=""></path></g></svg>
                        <span className='text-[11px]'>
                            {cartProducts.length > 0 && (
                                <span>({cartProducts.length})</span>
                            )}
                        </span>
                    </small>
                    <Cross1Icon className="w-4 h-4 text-gray-500 cursor-pointer hover:text-black" onClick={() => { cartDropDownRef.current.classList.add("translate-y-[-158%]"); }} />
                </span>
                <Separator className='mt-2 mb-1' />
                <div className="grid mb-4 items-start overflow-y-scroll custom_Scrollbar max-h-32">
                    {cartProductsData.map((item) => (
                        <article className='flex items-center gap-4' key={item.id}>
                            <img className='col-span-3 w-12 h-auto aspect-square object-cover' src={item.images[0].src} alt={`Photo de ${item.name}`} />
                            <div>
                                <h3 className='text-black text-sm font-medium'><small className='font-light'>{item.quantity}×</small> {item.name} </h3>
                                <h4 className='text-black text-sm font-normal'>{item.price}.د.م</h4>
                            </div>
                        </article>
                    ))}
                </div>
                <Separator className='mt-2 mb-1' />
                <div className='flex items-center justify-between'>
                    <span>Total:</span> <span>{TotalPrice} د.م</span>
                </div>
                <div className='flex justify-end mt-4'>
                    <Button variant="outline" aria-label="Continue to checkout" onClick={Payment}>Continue</Button>
                </div>
            </aside>
            <SheetTrigger aria-label="Cart">
                <svg width="24px" height="24px" viewBox="0 0 1024 1024" fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="10.24"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M800.8 952c-31.2 0-56-24.8-56-56s24.8-56 56-56 56 24.8 56 56-25.6 56-56 56z m-448 0c-31.2 0-56-24.8-56-56s24.8-56 56-56 56 24.8 56 56-25.6 56-56 56zM344 792c-42.4 0-79.2-33.6-84-76l-54.4-382.4-31.2-178.4c-2.4-19.2-19.2-35.2-37.6-35.2H96c-13.6 0-24-10.4-24-24s10.4-24 24-24h40.8c42.4 0 80 33.6 85.6 76l31.2 178.4 54.4 383.2C309.6 728 326.4 744 344 744h520c13.6 0 24 10.4 24 24s-10.4 24-24 24H344z m40-128c-12.8 0-23.2-9.6-24-22.4-0.8-6.4 1.6-12.8 5.6-17.6s10.4-8 16-8l434.4-32c19.2 0 36-15.2 38.4-33.6l50.4-288c1.6-13.6-2.4-28-10.4-36.8-5.6-6.4-12.8-9.6-21.6-9.6H320c-13.6 0-24-10.4-24-24s10.4-24 24-24h554.4c22.4 0 42.4 9.6 57.6 25.6 16.8 19.2 24.8 47.2 21.6 75.2l-50.4 288c-4.8 41.6-42.4 74.4-84 74.4l-432 32c-1.6 0.8-2.4 0.8-3.2 0.8z" fill=""></path></g></svg>
            </SheetTrigger>
            <SheetContent className="pt-16 px-6">
                <SheetHeader className='h-full'>
                    <SheetTitle>
                        <h2 className='font-bold text-xl'>Résumé de la Commande</h2>
                    </SheetTitle>
                    <SheetDescription className="grid grid-rows-12 h-full" >
                        <article className='row-span-10 overflow-scroll no-scrollbar max-h-full'>

                            {/* user address */}
                            <h2 className='font-bold text-xl pt-4'>Infos de retrait</h2>
                            <div className="flex items-center gap-2 pb-4 pt-2">
                                <svg viewBox="0 0 24 24" width="40px" height="40px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                <span className='w-full'>18 Rue Jean MOULIN, 78280 GUYANCOURT</span>

                                {/* dialog for updating the address of user */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" aria-label="Update">Mise à jour</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Actualiser l'adresse</DialogTitle>
                                            <DialogDescription>
                                                Mettre à jour votre adresse. Cliquez sur enregistrer lorsque vous avez terminé.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="adresse" className="text-left">
                                                    adresse
                                                </Label>
                                                <Input
                                                    id="adresse"
                                                    defaultValue="Pedro Duarte"
                                                    className="col-span-3 w-full"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" aria-label="submit">Enregistrer</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Products in Cart */}
                            {isItemInCart ? (
                                <>
                                    <h2 className='font-bold text-xl'>Ma commande</h2>
                                    <div className="grid gap-2 pb-4 pt-4 overflow-scroll no-scrollbar max-h-[40vh]">
                                        {cartProductsData.map((item) => (
                                            // <Product_card2 key={item.id} id={item.id} typee="fruits" imageUrl={item.images[0].src} name={item.name} price={item.price} />
                                            <div className="grid grid-cols-12 w-full gap-4 border-t pt-2 pr-6" key={item.id}>
                                                <img className='col-span-3 w-full h-auto aspect-square object-contain' src={item.images[0].src} alt={`Photo de ${item.name}`} />
                                                <div className="grid col-span-8 items-start">
                                                    <h3 className='text-black text-base font-bold'><small className='font-light'>{item.quantity}×</small> {item.name}</h3>
                                                    <h4 className='text-black text-sm font-medium'>{item.price}.د.م</h4>
                                                </div>
                                                <Button aria-label="Remove from cart" data-value={item.id} onClick={() => { RemoveFromCart(item.id) }} className="col-span-1 bg-transparent group hover:bg-transparent hover:shadow-gray-300 after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:bg-transparent after:!rounded-full relative !rounded-full p-1 aspect-square">
                                                    <Cross1Icon className='text-red-400 add_icon group-hover:text-red-700' />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    Aucun produit dans le panier
                                </>
                            )}

                            {/* Total payment */}
                            <h2 className='font-bold text-xl pt-4'>L'addition</h2>
                            <div className="flex flex-col gap-2 pb-8 pt-2">
                                <p className="flex justify-between items-center w-full text-base"><span>Sous-total HT</span><span className='font-bold text-base text-primary'> {TotalPrice}.د.م</span></p>
                                <p className="flex justify-between items-center w-full text-base">
                                    <span>Total TTC</span>
                                    <span className='font-bold text-base text-primary'>
                                        {TotalPrice} د.م
                                    </span>
                                </p>
                                <p className="flex justify-between items-center w-full py-4 px-1 bg-slate-100 text-xl"><span>Reste à payer</span><span className='font-bold text-primary'>{TotalPrice}.د.م</span></p>
                            </div>
                        </article>

                        {/* Continue to checkout */}
                        <article className='row-span-2 py-2 flex items-center justify-between border-t border-gray-500'>
                            <span className="current-price text-black text-xl"><span> {TotalPrice} </span>
                                <span>.د.م</span>
                                <sup> ttc</sup>
                            </span>
                            <Button variant="outline" aria-label="Continue to checkout" onClick={Payment}>Continue</Button>
                        </article>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
