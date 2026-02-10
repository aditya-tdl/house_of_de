import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axiosInstance from "@/api/axiosInstance";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    content: string;
    publishedAt: string;
    image?: string;
}

const SingleBlogPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    const fetchBlog = async () => {
        dispatch(showLoader());
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/journal/slug/${slug}`);
            if (response.data.success) {
                setBlog(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch blog post", error);
        } finally {
            setIsLoading(false);
            dispatch(hideLoader());
        }
    };

    if (isLoading && !blog) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-40 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-64 bg-muted mb-4" />
                        <div className="h-4 w-32 bg-muted" />
                    </div>
                </main>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-40 text-center">
                    <h1 className="font-serif text-3xl mb-6">Story Not Found</h1>
                    <Link to="/blog" className="luxury-button">
                        Back to Journal
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20">
                {/* Progress Bar */}
                <motion.div
                    className="fixed top-20 left-0 right-0 h-0.5 bg-foreground z-50 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1 }}
                />

                <article>
                    {/* Hero Section */}
                    <header className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
                        <div className="container mx-auto px-6 lg:px-12 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="max-w-4xl mx-auto"
                            >
                                <Link
                                    to="/blog"
                                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors mb-12 group w-fit"
                                >
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                    Back to Journal
                                </Link>

                                <div className="flex flex-wrap items-center gap-4 mb-8">
                                    <span className="luxury-label text-[10px] tracking-[0.2em]">{blog.category}</span>
                                    <span className="w-1 h-px bg-border sm:block hidden" />
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                                        <Clock size={12} /> {blog.readTime}
                                    </div>
                                    <span className="w-1 h-px bg-border sm:block hidden" />
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                                        <Calendar size={12} /> {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-serif mb-8 leading-[1.1] italic">
                                    {blog.title}
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground font-serif leading-relaxed italic">
                                    {blog.excerpt}
                                </p>
                            </motion.div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                            <span className="text-[300px] font-serif text-foreground/[0.02] select-none italic pointer-events-none">
                                {blog.category.charAt(0)}
                            </span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {blog.image && (
                        <section className="container mx-auto px-6 lg:px-12 -mt-12 md:-mt-20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="aspect-[21/9] bg-muted overflow-hidden border border-border shadow-2xl"
                            >
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </section>
                    )}

                    {/* Content Section */}
                    <section className="py-16 md:py-24 max-w-3xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="prose prose-stone prose-lg max-w-none"
                        >
                            <div className="luxury-text text-foreground leading-[1.8] whitespace-pre-wrap font-serif text-lg md:text-xl">
                                {blog.content}
                            </div>
                        </motion.div>

                        {/* Tags / Footer of Article */}
                        <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Filed under:</span>
                                <span className="px-3 py-1 border border-border text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-all cursor-default">
                                    {blog.category}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="text-[10px] uppercase tracking-[0.3em] font-medium border-b border-foreground hover:opacity-70 transition-opacity"
                                >
                                    Return to Top
                                </button>
                            </div>
                        </div>
                    </section>
                </article>

                {/* Read More Section (Placeholder for now) */}
                <section className="py-24 bg-secondary/20">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex flex-col items-center text-center">
                            <span className="luxury-label block mb-4">Deepen Your Knowledge</span>
                            <h2 className="section-heading mb-12 italic">More from the Atelier</h2>
                            <Link to="/blog" className="luxury-button">
                                Explore Full Journal
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SingleBlogPage;
