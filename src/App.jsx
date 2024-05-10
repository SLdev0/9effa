import { useEffect, useState } from "react";
import "./App.css";
import Header from "./ShopComponents/Header";
import Packs from "./ShopComponents/Packs";
import Aliments from "./ShopComponents/Aliments";
import { Route, Routes } from "react-router-dom";
function App() {

    const consumerKey = 'ck_80cd7e4357e0152a6a74f2fea3ed5d2b098d5849';
    const consumerSecret = 'cs_e1a55ae4cbb74f3cb7386dab643401c6086f4ded';
    const baseUrl = 'https://client.lahza.ma/wp-json/wc/v3/products';
    const [packs, setPacks] = useState([]);
    // state of fetching process has completed
    const [done, setDone] = useState(false);
    // ids of categories of products
    const [fruits, setFruits] = useState([]);
    const [vegetables, setVegetables] = useState([]);
    const [bio, setBio] = useState([]);
    const [PreparedV, setPreparedV] = useState([]);
    const vegetablesId = 81; const fruitsId = 80; const bioId = 79; const PreparedVID = 127; const packId = 88;
    useEffect(() => {
        async function fetchProducts() {
            const basicAuth = btoa(`${consumerKey}:${consumerSecret}`);
            const headers = {
                'Authorization': `Basic ${basicAuth}`,
            };

            let allProducts = [];
            let pageAll = 1;

            while (pageAll !== false) {
                const basicAuth = btoa(`${consumerKey}:${consumerSecret}`);
                const headers = {
                    'Authorization': `Basic ${basicAuth}`,
                };
                const response = await fetch(`${baseUrl}?per_page=100&page=${pageAll}`, { headers });

                if (!response.ok) {
                    throw new Error(`Error fetching products: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.length) {
                    allProducts = allProducts.concat(data);
                    pageAll++;
                } else {
                    pageAll = false;
                }
            }

            const jsonData = JSON.stringify(allProducts);
            sessionStorage.setItem('products', jsonData);

            const fetchCategory = async (categoryId, setState) => {
                let page = 1;
                let products = [];

                while (true) {
                    const response = await fetch(`${baseUrl}?category=${categoryId}&per_page=100&page=${page}`, { headers });

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

                setState(products);
                return products;
            };

            const [packs, vegetables, fruits, bio, PreparedV] = await Promise.all([
                fetchCategory(packId, setPacks), fetchCategory(vegetablesId, setVegetables), fetchCategory(fruitsId, setFruits),
                fetchCategory(bioId, setBio), fetchCategory(PreparedVID, setPreparedV),
            ]);

            setDone(true);

            const localpacks = JSON.stringify(packs);
            sessionStorage.setItem('localpacks', localpacks);

            const localVegetables = JSON.stringify(vegetables);
            sessionStorage.setItem('localVegetables', localVegetables);

            const localfruits = JSON.stringify(fruits);
            sessionStorage.setItem('localfruits', localfruits);

            const localbio = JSON.stringify(bio);
            sessionStorage.setItem('localbio', localbio);

            const localPreparedV = JSON.stringify(PreparedV);
            sessionStorage.setItem('localPreparedV', localPreparedV);

        }

        // Check if localpacks exists in session storage
        const localpacksString = sessionStorage.getItem('localpacks');

        if (!localpacksString) {
            fetchProducts();
        } else {
            setPacks(JSON.parse(localpacksString));
            setDone(true)
        }
    }, []);

    return (
        <>
            <Header />

            <Routes>
                {/* <Route path="/Fruits" element={<Fruits />} /> */}
                <Route path="/Aliments/:type" element={<Aliments />} />
                <Route path="/" element={<Packs />} />
                <Route path="/Packs" element={<Packs />} />
            </Routes>
        </>
    );
}

export default App;
