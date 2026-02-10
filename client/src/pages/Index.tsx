import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Collection from "@/components/Collection";
import Story from "@/components/Story";
import Appointment from "@/components/Appointment";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Collection />
        <Story />
        <Appointment />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
