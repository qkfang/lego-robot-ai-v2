import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider, BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import "./index.css";

import Layout from "./pages/layout/Layout";
import Chat from "./pages/chat/Chat";
import Voice from "./pages/voice/Voice";
import Brick from "./pages/brick/Brick";
import Image from "./pages/image/Image";
import About from "./pages/about/About";
import Home from "./pages/home/Home";

var layout = <Layout />;

initializeIcons();

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//         <RouterProvider router={router} />
// );

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
            <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Chat />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/brick" element={<Brick />} />
          <Route path="/image" element={<Image />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
    </React.StrictMode>
);

