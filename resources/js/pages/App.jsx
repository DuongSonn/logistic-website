import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Chat from "./Chat";
import Orders from "./Orders";
import Rating from "./Rating";

function App() {
    return (
        <Routes>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/rates" element={<Rating />} />
        </Routes>
    );
}
export default App;

const rootElement = document.getElementById("main");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
