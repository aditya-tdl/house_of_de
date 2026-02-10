import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import puristImage from "@/assets/formalist-shirt.png";
// import signatureImage from "@/assets/signature-shirt.jpg";
import formalistImage from "@/assets/purist-shirt.png";
import naturalistImage from "@/assets/naturalist-shirt.png";
import oxfordImage from "@/assets/oxford-shirt.jpg";
import eveningImage from "@/assets/evening-shirt.jpg";

const collections = [
  {
    id: "formalist",
    name: "THE FORMALIST",
    tagline: "Precision as power. Architecture over ease.",
    knows: "The Formalist knows: authority is built, never borrowed",
    description: "For those who command through structure. Engineered collars that hold their line. Crisp weaves that refuse to yield. Every seam deliberate, every detail calculated. This is the shirt for rooms where decisions are made, for moments that allow no margin.",
    image: formalistImage,
    features: ["EGYPTIAN GIZA COTTON", "STRUCTURED WEAVE"],
  },
  {
    id: "purist",
    name: "THE PURIST",
    tagline: "Essence over ornament. Quality that whispers.",
    knows: "The Purist knows: ease is the highest form of elegance",
    description: "For those who strip away everything but essential. No fusing, no stiffening, no pretense. Fabrics so refined they demand to be touched. The shirt that looks simple until someone stands close enough to understand.",
    image: puristImage,
    features: ["SUPIMA COTTON", "LIGHTWEIGHT WEAVE"],
  },
  {
    id: "naturalist",
    name: "THE NATURALIST",
    tagline: "Character over perfection. Ease as elegance.",
    knows: "The Naturalist believes: studied nonchalance is the final luxury.",
    image: naturalistImage,
    description: "For those who embrace texture, breath, life. Fabrics that wrinkle without apology, that wear their days visibly. Temperature-regulating, lived-in, unapologetically real. The choice of those who've transcended the need to impress.",
    features: ["LINEN", "EGYPTIAN COTTON", "NATURAL TEXTURE"],
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
              className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${index % 2 === 1 ? "md:direction-rtl" : ""
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
                <p className="luxury-text text-muted-foreground mb-4 max-w-md" style={{ marginLeft: index % 2 === 1 ? 'auto' : '0' }}>
                  {item.description}
                </p>
                {item.knows && (
                  <p className="luxury-text text-foreground/60 mb-6 max-w-md" style={{ marginLeft: index % 2 === 1 ? 'auto' : '0' }}>
                    {item.knows}
                  </p>
                )}

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

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-15 md:mt-20 max-w-2xl mx-auto"
        >
          <p className="text-xl md:text-2xl font-serif leading-relaxed text-foreground/80">
            Most require all three philosophies.<br />
            Your consultation determines which fabrics serve your needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Collection;
