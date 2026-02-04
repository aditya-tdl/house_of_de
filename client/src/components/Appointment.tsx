import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Appointment = () => {
  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs uppercase tracking-[0.3em] opacity-60 block mb-4">
            By Appointment Only
          </span>
          <h2 className="section-heading mb-8">Begin Your Journey</h2>
          <p className="luxury-text opacity-80 mb-10 max-w-xl mx-auto">
            A House of De shirt begins with a private consultation. We invite 
            you to experience the art of bespoke tailoring in our atelier.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointment"
              className="px-8 py-4 bg-background text-foreground text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:bg-background/90"
            >
              Schedule Consultation
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-primary-foreground/20 pt-12">
            {[
              { label: "Consultation", value: "60 min" },
              { label: "Delivery", value: "4-6 Weeks" },
              { label: "Starting From", value: "₹15,000" },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-xs uppercase tracking-[0.2em] opacity-60 block mb-2">
                  {item.label}
                </span>
                <span className="text-2xl font-serif">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Appointment;
