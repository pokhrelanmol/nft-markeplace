import Navbar from "./components/layout/Navbar";
import CreateNft from "./components/CreateNft";
import { useEffect } from "react";
import Home from "./components/layout/Home";

function App() {
    return (
        <div className="max-w-6xl m-auto">
            <Navbar />
            <CreateNft />
            <Home />
        </div>
    );
}

export default App;
