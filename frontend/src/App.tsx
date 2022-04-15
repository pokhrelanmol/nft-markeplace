import Navbar from "./components/layout/Navbar";
import CreateNft from "./components/CreateNft";
import { useEffect } from "react";
import Home from "./components/layout/Home";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import MyListedNft from "./components/MyListedNft";
import MyPurchase from "./components/MyPurchase";
function App() {
    return (
        <div className="max-w-6xl m-auto">
            <Router>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Home />
                            </>
                        }
                    />

                    <Route path="/create" element={<CreateNft />} />

                    <Route path="/my-nft" element={<MyListedNft />} />
                    <Route path="/my-purchases" element={<MyPurchase />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
