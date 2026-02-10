import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="section-heading mb-16 text-center">Privacy Policy</h1>

                        <div className="space-y-12 luxury-text text-foreground/80 leading-relaxed">
                            <section>
                                <p className="mb-4">
                                    House of De (“we”, “our”, “us”) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how information is collected, used, and safeguarded when you visit our website or engage with us.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">1. Information We Collect</h2>
                                <p className="mb-4">We may collect the following information when you interact with our website or communicate with us:</p>
                                <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-foreground/50">
                                    <li>Name</li>
                                    <li>Email address</li>
                                    <li>Phone number</li>
                                    <li>Any information you voluntarily provide through enquiry forms, email, or direct communication</li>
                                </ul>
                                <p>House of De does not process online payments or complete sales through the website.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">2. How We Use Your Information</h2>
                                <p className="mb-4">The information we collect is used solely to:</p>
                                <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-foreground/50">
                                    <li>Respond to enquiries and requests</li>
                                    <li>Arrange consultations or bespoke experiences</li>
                                    <li>Communicate information related to our products and services</li>
                                    <li>Improve our customer experience</li>
                                </ul>
                                <p>We do not sell, rent, or trade your personal information to third parties.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">3. Offline Sales & Bespoke Services</h2>
                                <p>All purchases and transactions are conducted offline through personalised consultations and arrangements. Any information shared during these interactions is treated with confidentiality and used strictly for service fulfilment.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">4. Data Security</h2>
                                <p>We take reasonable measures to protect your personal information from unauthorised access, disclosure, or misuse. While no digital platform is entirely secure, we strive to maintain appropriate safeguards.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">5. Cookies & Website Analytics</h2>
                                <p>Our website may use basic cookies or analytics tools to understand visitor behaviour and improve site performance. These tools do not collect personally identifiable information unless explicitly provided by you.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">6. Third-Party Links</h2>
                                <p>Our website may contain links to third-party websites. House of De is not responsible for the privacy practices or content of those external sites.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">7. Your Rights</h2>
                                <p className="mb-4">You may request to:</p>
                                <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-foreground/50">
                                    <li>Access the personal information we hold about you</li>
                                    <li>Correct or update your information</li>
                                    <li>Request deletion of your data</li>
                                </ul>
                                <p>Requests can be made by contacting us directly.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">8. Changes to This Policy</h2>
                                <p>We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page.</p>
                            </section>

                            <section className="pt-8 border-t border-border">
                                <h2 className="text-xl font-serif mb-6 text-foreground">9. Contact Us</h2>
                                <p className="mb-2">For questions regarding this Privacy Policy or your personal information, please contact:</p>
                                <p className="font-serif text-lg mb-1">House of De</p>
                                <a href="mailto:hello@houseofde.com" className="hover:text-foreground transition-colors border-b border-border hover:border-foreground pb-0.5">hello@houseofde.com</a>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
