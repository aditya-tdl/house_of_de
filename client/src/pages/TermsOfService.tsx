import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
                        <h1 className="section-heading mb-16 text-center">Terms of Use</h1>

                        <div className="space-y-12 luxury-text text-foreground/80 leading-relaxed">
                            <section>
                                <p className="mb-4">
                                    By accessing and using the House of De website, you agree to the following Terms of Use. If you do not agree, please refrain from using the site.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">1. About House of De</h2>
                                <p>House of De is a sole proprietorship focused on curating bespoke experiences and exclusive deals in premium-quality white shirts. The website serves as an informational platform only. No sales are conducted online.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">2. Website Use</h2>
                                <p className="mb-4">You agree to use this website for lawful purposes only. You may not:</p>
                                <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-foreground/50">
                                    <li>Attempt to disrupt or compromise the website’s functionality</li>
                                    <li>Use the website for fraudulent or misleading activities</li>
                                    <li>Reproduce, copy, or exploit website content without permission</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">3. Intellectual Property</h2>
                                <p className="mb-4">All content on this website-including text, imagery, branding, and design-is the intellectual property of House of De unless otherwise stated.</p>
                                <p>Unauthorised use, reproduction, or distribution of any content is prohibited.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">4. No Online Transactions</h2>
                                <p className="mb-4">House of De does not offer online purchasing or payment processing. Any product discussions, pricing, or transactions occur offline through direct engagement.</p>
                                <p>Information displayed on the website does not constitute a binding offer.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">5. Limitation of Liability</h2>
                                <p className="mb-4">House of De makes reasonable efforts to ensure website accuracy but does not guarantee that all content is complete, current, or error-free.</p>
                                <p className="mb-2">We are not liable for:</p>
                                <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-foreground/50">
                                    <li>Any loss arising from reliance on website information</li>
                                    <li>Temporary unavailability of the website</li>
                                    <li>External links or third-party content</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">6. User Submissions</h2>
                                <p>Any information or content you submit via forms or email must be accurate and lawful. You grant House of De permission to use submitted information solely for communication and service purposes.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">7. Changes to Terms</h2>
                                <p>We reserve the right to update these Terms of Use at any time. Continued use of the website constitutes acceptance of the revised terms.</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-serif mb-6 text-foreground">8. Governing Law</h2>
                                <p>These Terms of Use are governed by the applicable laws of Karnataka.</p>
                            </section>

                            <section className="pt-8 border-t border-border">
                                <h2 className="text-xl font-serif mb-6 text-foreground">9. Contact Information</h2>
                                <p className="mb-2">For any questions regarding these Terms of Use, please contact:</p>
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

export default TermsOfService;
