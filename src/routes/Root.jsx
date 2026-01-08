import { Outlet } from "react-router";
import Navbar from "../common/navbar/Navbar";
import Footer from "../common/footer/Footer";

const Root = () => {
    return (
        <section>
            <Navbar />
            <Outlet />
            <Footer />
        </section>
    );
};

export default Root;
