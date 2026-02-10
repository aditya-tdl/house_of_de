import { motion } from "framer-motion";

const Story = () => {
  return (
    <section id="story" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="luxury-label block mb-4">Our Philosophy</span>
            <h2 className="section-heading mb-8">The Pursuit of Perfection</h2>
            <div className="luxury-divider mb-8" />
            
            <div className="space-y-6 luxury-text text-muted-foreground">
              <p>
                At House of De, we believe the white shirt is the foundation of a 
                gentleman's wardrobe. It is not merely a garment—it is a statement 
                of intent, a canvas of character.
              </p>
              <p>
                Each shirt we create is born from a singular obsession: to craft 
                the perfect white shirt. We source the finest fabrics from Italian 
                mills, work with master craftsmen who have dedicated their lives to 
                this singular art, and refuse to compromise on a single stitch.
              </p>
              <p>
                This is not fast fashion. This is the antithesis of disposable. 
                A House of De shirt is designed to be worn, loved, and passed down.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            {[
              {
                number: "01",
                title: "Bespoke Craft",
                description: "Every shirt is made to your exact measurements. No two are alike.",
              },
              {
                number: "02",
                title: "Finest Materials",
                description: "We source only from the world's most prestigious textile houses.",
              },
              {
                number: "03",
                title: "Master Tailors",
                description: "Decades of expertise in every stitch, every seam, every button.",
              },
              {
                number: "04",
                title: "Timeless Design",
                description: "Classic silhouettes that transcend trends and seasons.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="flex gap-6"
              >
                <span className="text-4xl font-serif text-muted-foreground/30">{value.number}</span>
                <div>
                  <h3 className="text-xl font-serif mb-2">{value.title}</h3>
                  <p className="luxury-text text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Story;
