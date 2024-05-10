import React, { useEffect, useState } from 'react'
import PackCard from './PackCard';
import { Skeleton } from "@/components/ui/skeleton"
export default function Packs() {
    const consumerKey = 'ck_80cd7e4357e0152a6a74f2fea3ed5d2b098d5849';
    const consumerSecret = 'cs_e1a55ae4cbb74f3cb7386dab643401c6086f4ded';
    const baseUrl = 'https://client.lahza.ma/wp-json/wc/v3/products';
    const [packs, setPacks] = useState([]);
    const [done, setDone] = useState(false);
    const packId = 88;
    useEffect(() => {
        async function fetchCategoryProducts() {
            const basicAuth = btoa(`${consumerKey}:${consumerSecret}`);
            const headers = {
                'Authorization': `Basic ${basicAuth}`,
            };
            let products = [];
            let page = 1;

            while (true) {
                const response = await fetch(`${baseUrl}?category=${packId}&per_page=100&page=${page}`, { headers });

                if (!response.ok) {
                    throw new Error(`Error fetching products: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.length) {
                    products = products.concat(data);
                    page++;
                } else {
                    break;
                }
            }

            setPacks(products);
            setDone(true);
            sessionStorage.setItem('localpacks', JSON.stringify(products));
        }

        // Check if localpacks exists in session storage
        const localpacksString = sessionStorage.getItem('localpacks');

        if (!localpacksString) {
            fetchCategoryProducts();
        } else {
            setPacks(JSON.parse(localpacksString));
            setDone(true);
        }
    }, []);



    return (
        <div className='w-full py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 packs'>
            {!done && Array.from({ length: 5 }, (_, i) => (
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
                    {packs.map((pack) => (
                        <PackCard
                            key={`key_${pack.id}`}
                            id={pack.id}
                            imageUrl={pack.images[0].src}
                            name={pack.name}
                            price={pack.price}
                            variations={pack.variations}
                        />
                    ))}
                </>
            )}
        </div>
    )
}
