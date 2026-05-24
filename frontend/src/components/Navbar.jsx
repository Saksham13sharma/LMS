import React, { useEffect, useRef, useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles'
import logo from '../assets/logo.png'
import {BookMarked, BookOpen, BookOpenText, Contact, Home, Users} from 'lucide-react'
import { NavLink } from 'react-router-dom';
import { useAuth, useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X } from "lucide-react";

const baseNav = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Courses", icon: BookOpen, href: "/courses" },
  { name: "About", icon: BookMarked, href: "/about" },
  { name: "Faculty", icon: Users, href: "/faculty" },
  { name: "Contact", icon: Contact, href: "/contact" },
];

const Navbar = () => {

    // for Clerk
    const { openSignUp } = useClerk();
    const { isLoaded: userLoaded, isSignedIn } = useUser();
    const { getToken, isLoaded: authLoaded } = useAuth();

    // for mobile toggle
    const [isOpen, setIsOpen] = useState(false)
    const [lastScrolly, setLastScrolly] = useState(0)

    const [isScrolled, setIsScrolled] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true)

    const menuRef=useRef(null);
    const isLoggedIn = isSignedIn && Boolean(localStorage.getItem("token"));

    const navItems=isSignedIn ? [
        ...baseNav,
        { name: "My Courses", icon: BookOpenText, href: "/mycourses" },
    ] : baseNav;

    // fetch token once Clerk auth state is loaded and signed in
    useEffect(() => {
        console.log("Clerk auth state:", { authLoaded, userLoaded, isSignedIn });
        if (!authLoaded || !userLoaded || !isSignedIn) return;

        const loadToken = async () => {
            console.log("Clerk token fetch triggered");
            try {
                const token = await getToken();
                console.log("Clerk getToken raw result:", token);
                if (!token) {
                    console.warn("Clerk getToken returned no token");
                    return;
                }
                localStorage.setItem("token", token);
                console.log("Clerk Login Token:", token);
            } catch (error) {
                console.error("Clerk getToken error:", error);
            }
        };

        loadToken();
    }, [authLoaded, userLoaded, isSignedIn, getToken]);

    useEffect(() => {
        console.log("Navbar mounted");
    }, []);

    // remove token when signout
    useEffect(() => {
        if (!isSignedIn) {
            localStorage.removeItem("token");
            console.log("Clerk Token Remove");
        }
    }, [isSignedIn]);

    // INSTANT token removal using Clerk logout event
    useEffect(() => {
        const handleLogout = () => {
        localStorage.removeItem("token");
        console.log("Token removed instantly on Clerk logout event");
        };

        window.addEventListener("user:signed_out", handleLogout);
        return () => window.removeEventListener("user:signed_out", handleLogout);
    }, []);

    // Scroll hide/show
    useEffect(() => {
        const handleScroll = () => {
        const scrolly = window.scrollY;
        setIsScrolled(scrolly > 20);

        if (scrolly > lastScrolly && scrolly > 100) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
        setLastScrolly(scrolly);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrolly]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const descktopLinkClass = (isActive) => {
    return `${navbarStyles.desktopNavItem} ${
        isActive ? navbarStyles.desktopNavItemActive : ""
    }`;
    };

    const mobileLinkClass = (isActive) => {
    return `${navbarStyles.mobileMenuItems} ${
        isActive
        ? navbarStyles.mobileMenuItemActive
        : navbarStyles.mobileMenuItemHover
    }`;
    };

  return (
    <nav className={`${navbarStyles.navbar} ${ 
        showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
    } ${
        isScrolled ? navbarStyles.navbarScrolled : navbarStyles.navbarDefault
    }`}>
        <div className={navbarStyles.container}>
            <div className={navbarStyles.innerContainer}>
                {/* LOGO */}
                <div className="flex items-center gap-3 select-none">
                    <img src={logo} alt="Logo" className='w-12 h-12' />
                    <div className='text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-sky-700 to-cyan-600 font-serif leading-[0.95] '>
                        SamEduHub
                    </div>
                </div>

                {/* decktop nav */}
                <div className={navbarStyles.desktopNav}>
                    <div className={navbarStyles.desktopNavContainer}>
                        {navItems.map((item)=>{
                            const Icon=item.icon
                            return (
                                <NavLink key={item.name} to={item.href} end={item.href === '/'} 
                                className={({isActive})=> descktopLinkClass(isActive) }>
                                    <div className='flex items-center space-x-4'>
                                        <Icon size={16} className={navbarStyles.desktopNavIcon} />
                                        <span className={navbarStyles.desktopNavText}>
                                            {item.name}
                                        </span>
                                        
                                    </div>

                                </NavLink>
                            )
                        })}
                    </div>
                </div>
                {/* right side */}
                <div className={navbarStyles.authContainer}>
                    { !isSignedIn ? (
                        <button
                            type='button'
                            onClick={() => {
                                console.log("Clerk sign-up button clicked");
                                openSignUp({});
                            }}
                            className={navbarStyles.createAccountButton ?? navbarStyles.loginButton}
                        >
                            <span>Create Account</span>
                        </button>
                    ) : (
                        <div className='flex items-center'>
                            <UserButton afterSignOutUrl='/' />
                        </div>
                    )}

                        {/* toggle button */}
                        <button onClick={()=>setIsOpen(!isOpen)} className={navbarStyles.mobileMenuButton}>
                            { isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                </div>
            </div>
            {/* mobile nav */}
            <div ref={menuRef} className={`${navbarStyles.mobileMenu}
            ${isOpen ? navbarStyles.mobileMenuOpen : navbarStyles.mobileMenuClosed}`}>
                <div className={navbarStyles.mobileMenuContainer}>
                    <div className={`${navbarStyles.mobileMenuItem} flex flex-col space-y-4`} >
                        {navItems.map((item)=>{
                            const Icon =item.icon;
                            return (
                                <NavLink key={item.name} to={item.href} end={item.href === '/'}
                                className={({isActive})=> mobileLinkClass(isActive)}
                                onClick={()=> setIsOpen(false)}>
                                    <div className={navbarStyles.mobileMenuIconContainer}>
                                        <Icon size ={18} className={navbarStyles.mobileMenuIcon} />
                                    </div>
                                    <span className={navbarStyles.mobileMenuText}>
                                        {item.name}
                                    </span>
                                </NavLink>
                            );
                        })}
                        {!isSignedIn ? (
                            <button type='button' onClick={()=>{
                                console.log("Clerk mobile sign-up button clicked");
                                openSignUp({});
                                setIsOpen(false)
                            }} className={
                                navbarStyles.mobileCreateAccountButton ?? navbarStyles.mobileLoginButton}>
                                    <span>Create Account</span>
                                </button>
                        ) :(
                            <div className='px-4 py-2'>
                                <UserButton afterSwitchSessionUrl='/' />
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className={navbarStyles.backgroundPattern}>
            <div className={navbarStyles.pattern}></div>

        </div>

    </nav>
  )
}

export default Navbar
