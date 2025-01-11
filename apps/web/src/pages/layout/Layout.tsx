import { useEffect } from 'react';
import { lazy, Suspense } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import Toolbar from '../../components/Toolbar';
import styles from "./Layout.module.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Styles } from "../../styles/styles";

const Layout = () => {


    return (
        <Suspense fallback={null}>
            <Styles />
            <Header />
            <div className={styles.layout}>
                <header className={styles.header} role={"banner"}>
                </header>
                <Outlet />
            </div>
            <Footer />
        </Suspense>
    );
};

export default Layout;