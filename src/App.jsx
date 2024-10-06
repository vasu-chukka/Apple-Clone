import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Footer from "./components/Footer";
import Features from "./components/Features";
import ChipSection from "./components/ChipSection";

const App = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Highlights />
      <Features />
      <ChipSection />
      <Footer />
    </main>
  );
};

export default App;
