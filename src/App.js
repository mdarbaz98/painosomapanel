import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';
import Dashboard from './components/Dashboard';
import PrimeReact from 'primereact/api';
import { Toast } from "primereact/toast";
import { Tooltip } from 'primereact/tooltip';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import Blogs from './components/Blogs';
import Categories from './components/Categories';
import products from './components/products';
import Gallery from './components/Image';
import Author from './components/Author';
import Login from './components/Login';
import { AuthContext } from './context/authContext';

const App = () => {
    const [layoutMode, setLayoutMode] = useState('overlay');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const toast = useRef(null);



    const [value, setValue] = useState("dfs");

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Home',
            items: [{
                label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
            }]
        },
        {
            label: 'Get Started', icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Categories', icon: 'pi pi-th-large', to: '/category'
                }, {
                    label: 'Blogs', icon: 'pi pi-book', to: '/blog'
                },
                {
                    label: 'products', icon: 'pi pi-box', to: '/products'
                },
                {
                    label: 'Gallery', icon: 'pi pi-images', to: '/gallery'
                },
                {
                    label: 'Author', icon: 'pi pi-user', to: '/author'
                },
            ]
        },

        // {
        //     label: 'UI Components', icon: 'pi pi-fw pi-sitemap',
        //     items: [
        //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout' },
        //         { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input' },
        //         { label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/floatlabel" },
        //         { label: "Invalid State", icon: "pi pi-fw pi-exclamation-circle", to: "invalidstate" },
        //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button' },
        //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/table' },
        //         { label: 'List', icon: 'pi pi-fw pi-list', to: '/list' },
        //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree' },
        //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel' },
        //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay' },
        //         { label: "Media", icon: "pi pi-fw pi-image", to: "/media" },
        //         { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu' },
        //         { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/messages' },
        //         { label: 'File', icon: 'pi pi-fw pi-file', to: '/file' },
        //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart' },
        //         { label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc' },
        //     ]
        // },
        // {
        //     label: 'UI Blocks',
        //     items: [
        //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: "NEW" },
        //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-react' }
        //     ]
        // },
        // {
        //     label: 'Icons',
        //     items: [
        //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/icons' }
        //     ]
        // },
        // {
        //     label: 'Pages', icon: 'pi pi-fw pi-clone',
        //     items: [
        //         { label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud' },
        //         { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline' },
        //         { label: 'Empty', icon: 'pi pi-fw pi-circle-off', to: '/empty' }
        //     ]
        // },
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });


    return (
        <AuthContext.Provider value={{value,setValue}}>
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Toast ref={toast} />
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

           {value &&  <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />}

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                {value ?
                    <div className="layout-main">
                        <Route path="/" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />
                        <Route path="/category" component={Categories} />
                        <Route path="/blog" component={Blogs} />
                        <Route path="/products" component={products} />
                        <Route path="/gallery" component={Gallery} />
                        <Route path="/author" component={Author} />
                        <Route path="/Login" component={Login} />
                    </div>
                    :
                    <Login ></Login>}


                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
        </AuthContext.Provider >
    );

}

export default App;
