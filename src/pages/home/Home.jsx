import AboutSection from "./components/AboutSection";
import CanvaSection from "../canvas/CanvaSection";
import GallerySection from "./components/GallerySection";
import Hero from "./components/Hero";
import FindMatch from "./components/FindMatch";

const Home = () => {
    return (
        <div>
            <Hero />
            <GallerySection />
            <FindMatch />
            <AboutSection />
        </div>
    );
};

export default Home;