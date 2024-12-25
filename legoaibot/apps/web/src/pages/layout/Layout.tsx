import { useEffect } from 'react';
import { Outlet, NavLink, Link } from "react-router-dom";
import Toolbar from '../../components/Toolbar';
import styles from "./Layout.module.css";

const Layout = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "/public/app.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h3 className={styles.headerTitle}>Lego Robot AI</h3>
                    </Link>
                    {/* <nav>
                        <ul className={styles.headerNavList}>
                            <li className={styles.headerNavLeftMargin}>
                                <a href="https://spike.legoeducation.com/" target={"_blank"}>
                                Spike Prime
                                </a>
                            </li>
                        </ul>
                    </nav> */}
                    {/* <div className={styles.headerRightText}>Build a <a href="https://spike.legoeducation.com/" target="_blank">Spike Prime 3</a> Lego Robot and control it by python!</div> */}
                    <Toolbar />
                </div>
            </header>
            <Outlet />
            <main className="container">
                <article>
                    <button id="toggleButton" className="black-button">Start Conversation</button>
                    <div id="statusMessage"></div>
                    <pre id="report"></pre>
                </article>
            </main>
        </div>
    );
};

export default Layout;