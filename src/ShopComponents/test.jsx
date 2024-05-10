import React, { useEffect, useState } from 'react';
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
export default function Aliments() {
    const [packsInCarts, setPacksInCarts] = useState([])
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
            aliments.map((al) => {
                console.log(al.variations)
                console.log(al.attributes)
            })
        } else {
            fetchCategory();
        }
    }, [type]);

    return (
        <div className='w-full py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-8 gap-5 packs'>
            g
        </div>
    );
}