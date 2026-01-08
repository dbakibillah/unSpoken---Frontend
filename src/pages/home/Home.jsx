import AboutSection from "./components/AboutSection";
import CanvaSection from "./components/CanvaSection";
import GallerySection from "./components/GallerySection";
import Hero from "./components/Hero";

const Home = () => {
    return (
        <div>
            <Hero />
            <CanvaSection />
            <GallerySection />
            <AboutSection />
        </div>
    );
};

export default Home;