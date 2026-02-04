import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axiosInstance from "@/api/axiosInstance";
import { format } from "date-fns";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  image?: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      // Fetch only published blogs for the public page
      const response = await axiosInstance.get("/journal?status=PUBLISHED");
      if (response.data.success) {
        setBlogs(response.data.data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch journal entries", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="luxury-label block mb-4">The Journal</span>
              <h1 className="section-heading mb-6">Stories of Craft</h1>
              <p className="luxury-text text-muted-foreground">
                Insights into the world of bespoke tailoring, fabric traditions,
                and the timeless art of the white shirt.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse">
                    <div className="aspect-[4/3] bg-muted mb-6" />
                    <div className="h-4 bg-muted w-24 mb-4" />
                    <div className="h-8 bg-muted w-full mb-3" />
                    <div className="h-20 bg-muted w-full" />
                  </div>
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {blogs.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      {/* Image Placeholder or Actual Image */}
                      <div className="aspect-[4/3] bg-muted mb-6 overflow-hidden border border-border/50">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                            <span className="text-[120px] font-serif text-foreground/[0.03] select-none">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex items-center gap-4 mb-4">
                        <span className="luxury-label text-[10px] tracking-[0.2em]">{post.category}</span>
                        <span className="w-1 h-px bg-border" />
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{post.readTime}</span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-serif mb-4 leading-tight group-hover:italic transition-all duration-300">
                        {post.title}
                      </h2>

                      <p className="luxury-text text-muted-foreground mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground/60 border-t border-border pt-4 block w-fit">
                        {post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : "DRAFT"}
                      </span>
                    </Link>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border">
                <p className="luxury-text italic text-muted-foreground">The journal is currently being curated. Check back soon for new stories.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-xl mx-auto"
            >
              <h3 className="text-2xl md:text-3xl font-serif mb-4 lowercase italic">Stay Informed</h3>
              <p className="luxury-text text-muted-foreground mb-8">
                Receive our latest articles on craftsmanship, style guides, and exclusive invitations.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="DIGITAL COORDINATES"
                  className="flex-1 py-3 px-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors text-[10px] uppercase tracking-widest"
                />
                <button type="submit" className="luxury-button px-8">
                  SUBSCRIBE
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
