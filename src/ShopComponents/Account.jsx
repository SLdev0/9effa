import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


export default function Account() {
    const [is_logged_in, setIs_logged_in] = useState(false)
    const [not_valid, setNot_valid] = useState(false)
    function toggle_forms() {
        const loginForm = document.querySelector('.login_form');
        const signupForm = document.querySelector('.signup_form');
        loginForm.classList.toggle('flex');
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('flex');
        signupForm.classList.toggle('hidden');
    }

    function isValidEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    function isComplexPassword(password) {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        return regex.test(password);
    }

    function validateEmail(e, key) {
        const email = e.target.value;
        const emailError = document.querySelector(`.${key} .emailError`);
        console.log(`.${key} .emailError`)
        if (!isValidEmail(email)) {
            emailError.classList.add("block")
            emailError.classList.remove("hidden")
            setNot_valid(true)
            return;
        } else {
            emailError.classList.add("hidden")
            emailError.classList.remove("block")
            setNot_valid(false)
        }
    }

    function validatePass(e, key) {
        const pass = e.target.value;
        const passError = document.querySelector(`.${key} .passError`);
        if (!isComplexPassword(pass)) {
            passError.classList.add("block")
            passError.classList.remove("hidden")
            setNot_valid(true)
            return;
        } else {
            passError.classList.add("hidden")
            passError.classList.remove("block")
            setNot_valid(false)
        }
    }

    function confirmationPass(e) {
        const rPassValue = e.target.value;
        const pass = document.querySelector('#passs').value;
        const rpassError = document.querySelector('.rpassError');
        if (rPassValue !== pass) {
            setNot_valid(true)
            rpassError.classList.remove("hidden")
            rpassError.classList.add("block")
        } else {
            setNot_valid(false)
            rpassError.classList.remove("block")
            rpassError.classList.add("hidden")
        }
    }

    return (
        <Sheet>
            <SheetTrigger aria-label="Account">
                <svg width="26px" height="26px" viewBox="0 0 1024 1024" fill="#000000" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="10.24"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M309.52 494.12c-1.94 0-3.47 0.28-4.67 0.76 1.63-0.49 3.37-0.76 5.16-0.76h-0.49z m535.61 213.4c0.05-0.99 0.18-1.96 0.39-2.9-0.23 0.43-0.35 1.35-0.39 2.9z m35.73-394.23c0.01-0.04 0.01-0.09 0.01-0.13v-0.46c0 0.2 0 0.4-0.01 0.59z m-35.75-0.06c0 0.04 0 0.08 0.01 0.12-0.01-0.21-0.01-0.43-0.01-0.65v0.53z m21.563 536.2a348 348 0 0 0-32.69-107.48c-3.26-6.62-6.71-13.13-10.37-19.51a0.21 0.21 0 0 0-0.04-0.06c-15.86-26.86-35.32-51.8-58-74.06l-0.01-0.01c-4.93-4.84-10.01-9.56-15.24-14.14-37.29-32.68-80.34-56.91-126.25-71.65 8.31-4.6 16.35-9.76 24.07-15.47 8.79-6.48 17.16-13.68 25.03-21.55 41.39-41.39 64.19-96.43 64.19-154.97 0-58.54-22.8-113.58-64.19-154.97-40.64-40.64-94.44-63.35-151.78-64.17-0.91-0.01-1.82-0.02-2.73-0.02-0.91 0-1.82 0.01-2.73 0.02-57.34 0.82-111.14 23.53-151.78 64.17-41.39 41.39-64.19 96.43-64.19 154.97 0 58.54 22.8 113.58 64.19 154.97 7.87 7.87 16.24 15.07 25.03 21.55 7.72 5.71 15.76 10.87 24.07 15.47-45.91 14.74-88.96 38.97-126.25 71.65-5.23 4.58-10.31 9.3-15.24 14.14-22.7 22.28-42.18 47.24-58.05 74.13-3.66 6.38-7.11 12.89-10.37 19.51a348 348 0 0 0-32.69 107.48c-1.61 12 6.81 23.03 18.8 24.64 0.99 0.13 1.98 0.2 2.95 0.2 0.89 0 1.76-0.05 2.63-0.16 8.67-1.89 15.67-8.96 17.03-18.25 10.1-69.32 43.14-132.31 90.63-180.28 56.36-56.95 133.07-92.74 215.97-92.88h0.47c82.72 0.28 159.25 36.04 215.5 92.88 47.49 47.97 80.53 110.96 90.63 180.28 1.36 9.27 8.33 16.33 16.98 18.24 0.02 0 0.03 0.01 0.05 0.01 0.87 0.11 1.74 0.16 2.63 0.16 0.97 0 1.96-0.07 2.95-0.2 11.99-1.61 20.41-12.64 18.8-24.64z m-348.48-303.57c-0.44 0-0.88 0-1.32-0.01-81.8-0.6-154.73-57.43-174.66-133.66-0.22-0.83-0.44-1.67-0.64-2.51-3.12-12.6-4.78-25.7-4.78-39.15s1.66-26.7 4.78-39.52c0.2-0.86 0.42-1.71 0.64-2.56 20.04-78.14 93.65-140.25 175.98-140.25h0.94c82.33 0 155.94 62.11 175.98 140.25 0.22 0.85 0.44 1.7 0.64 2.56 3.12 12.82 4.78 26.07 4.78 39.52 0 13.45-1.66 26.55-4.78 39.15-0.2 0.84-0.42 1.68-0.64 2.51-19.93 76.23-92.86 133.06-174.66 133.66-0.75 0.01-1.5 0.01-2.26 0.01z" fill=""></path></g></svg>
            </SheetTrigger>
            <SheetContent className="pt-16 px-6">
                {
                    is_logged_in ? (

                        <SheetHeader>
                            <SheetTitle>
                                <h2 className='font-bold text-xl'>Mon compte</h2>
                            </SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    ) :
                        (

                            <SheetHeader className="h-full flex flex-col justify-center">
                                <SheetTitle>
                                    <h2 className='font-bold text-2xl mb-4'>Connection</h2>
                                </SheetTitle>
                                <SheetDescription>
                                    <form action='#' className='flex flex-col gap-2 login_form'>
                                        <Label className="font-semibold text-sm " htmlFor="emaill">Identifiant ou adresse e-mail</Label>
                                        <Input id="emaill" type="text" name="email" className={not_valid ? "!ring-pink-700" : ""} onInput={(e) => validateEmail(e, 'login_form')} autoComplete="email" />
                                        <p className="-mt-1 hidden text-pink-800 text-sm emailError">
                                            Veuillez saisir une adresse électronique valide.
                                        </p>
                                        <Label className="font-semibold text-sm mt-2" htmlFor="pass">Mot de passe</Label>
                                        <Input id="pass" type="password" name="password" className={not_valid ? "!ring-pink-700" : ""} onInput={(e) => validatePass(e, 'login_form')} autoComplete="mot de passe" />
                                        <p className="-mt-1 hidden text-pink-800 text-sm passError">
                                            Veuillez saisir un mot de passe valide.
                                        </p>
                                        <Button type="submit" className=" mt-2">Se connecter</Button>
                                        <span>Pas encore inscrit ?<Button type="button" variant="link" className="ml-0 pl-2 font-bold signup_btn" onClick={toggle_forms}>Créer mon compte</Button></span>
                                    </form>
                                    <form action='#' className='flex-col gap-2 hidden signup_form'>
                                        <Label className="font-semibold text-sm" htmlFor="email">Identifiant ou adresse e-mail</Label>
                                        <Input id="email" type="text" name="email" className={not_valid ? "!ring-pink-700" : ""} onInput={(e) => validateEmail(e, 'signup_form')} />
                                        <p className="-mt-1 hidden text-pink-800 text-sm emailError">
                                            Veuillez saisir une adresse électronique valide.
                                        </p>
                                        <Label className="font-semibold text-sm mt-2" htmlFor="passs">Mot de passe</Label>
                                        <Input id="passs" type="password" name="password" className={not_valid ? "!ring-pink-700" : ""} onInput={(e) => validatePass(e, 'signup_form')} autoComplete="mot de passe" />
                                        <p className="-mt-1 hidden text-pink-800 text-sm passError">
                                            Veuillez saisir un mot de passe valide.
                                        </p>
                                        <Label className="font-semibold text-sm mt-2" htmlFor="r_pass">Confirmation du mot de passe</Label>
                                        <Input id="r_pass" name="confirm_password" type="password" className={not_valid ? "!ring-pink-700" : ""} onInput={(e) => confirmationPass(e)} autoComplete="confirmer le mot de passe" />
                                        <p className="-mt-1 hidden text-pink-800 text-sm rpassError">
                                            Les mots de passe ne sont pas identiques
                                        </p>
                                        <Button type="submit" className=" mt-2">Se connecter</Button>
                                        <span>Déjà inscrit ? <Button type="button" variant="link" className="ml-0 pl-2 font-bold login_btn" onClick={toggle_forms}>Se connecter</Button></span>
                                    </form>

                                </SheetDescription>
                            </SheetHeader>
                        )
                }
            </SheetContent>
        </Sheet>
    )
}
