
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AuthContext } from './context/authContext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { SplitButton } from "primereact/splitbutton";


export const AppTopbar = (props) => {
    const { value,setValue } = useContext(AuthContext);
    const toast = useRef(null);
    const items = [
        {
            label: 'Logout',
            icon: 'pi pi-power-off',
            command: () => { 
                localStorage.clear();
                setValue(null)
            }
        }
    ];
    return (
        <div className="layout-topbar">
                  <Toast ref={toast}></Toast>
            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark.svg' : 'assets/layout/images/logo-white.svg'} alt="logo" />
                <span>Painosoma</span>
            </Link>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                <li>
                    <SplitButton className='p-button-primary mr-2 mb-2' label={value} icon="pi pi-user"  model={items}  onClick={props.onMobileSubTopbarMenuClick}>
                      
                    </SplitButton>
                </li>
            </ul>
        </div>
    );
}
