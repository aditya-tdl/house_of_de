import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import signatureImage from "@/assets/signature-shirt.jpg";
import oxfordImage from "@/assets/oxford-shirt.jpg";
import eveningImage from "@/assets/evening-shirt.jpg";

const collections = [
  {
    id: "signature",
    name: "The Signature",
    tagline: "Your Definitive White",
    description: "Impeccable fit, luxury fabric. The shirt that justifies our existence. Crafted from the finest Egyptian cotton with mother-of-pearl buttons and single-needle stitching.",
    image: signatureImage,
    features: ["Egyptian Cotton", "Mother-of-Pearl Buttons", "Single-Needle Stitching"],
  },
  {
    id: "oxford",
    name: "The Oxford",
    tagline: "Weekend Refined",
    description: "Slightly more casual, weekend-appropriate. For the gentleman who understands the full white shirt wardrobe. Soft oxford weave with a relaxed yet refined silhouette.",
    image: oxfordImage,
    features: ["Oxford Weave", "Button-Down Collar", "Relaxed Fit"],
  },
  {
    id: "evening",
    name: "The Evening",
    tagline: "Black Tie Elegance",
    description: "Dress shirt with formal details for weddings and formal events. French cuffs, marcella bib front, and a wing collar that commands attention.",
    image: eveningImage,
    features: ["French Cuffs", "Marcella Bib", "Wing Collar"],
  },
];

const Collection = () => {
  return (
    <section id="collection" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="luxury-label block mb-4">The Collection</span>
          <h2 className="section-heading">Three Icons of White</h2>
        </motion.div>

        {/* Collection Grid */}
        <div className="space-y-24 md:space-y-32">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${
                index % 2 === 1 ? "md:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden aspect-[4/5] ${index % 2 === 1 ? "md:order-2" : ""}`}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-background/95 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}>
                <span className="luxury-label block mb-3">{item.tagline}</span>
                <h3 className="text-4xl md:text-5xl font-serif mb-6">{item.name}</h3>
                <div className="luxury-divider mb-6 mx-auto md:mx-0" style={{ marginLeft: index % 2 === 1 ? 'auto' : '0' }} />
                <p className="luxury-text text-muted-foreground mb-8 max-w-md" style={{ marginLeft: index % 2 === 1 ? 'auto' : '0' }}>
                  {item.description}
                </p>
                
                {/* Features */}
                <div className={`flex flex-wrap gap-4 mb-8 ${index % 2 === 1 ? "md:justify-end" : ""}`}>
                  {item.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs uppercase tracking-wider border border-border px-4 py-2"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link
                  to="/appointment"
                  className="luxury-button-outline inline-block"
                >
                  Commission This Shirt
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;
