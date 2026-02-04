import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Clock,
    Tag,
    FileText,
    CheckCircle2,
    CircleDashed,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X,
    Filter,
    RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import axiosInstance from "@/api/axiosInstance";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";
import { toast } from "sonner";
import ConfirmationModal from "@/components/ConfirmationModal";

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
    publishedAt: string | null;
    createdAt: string;
}

const BlogManagement = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
    const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        readTime: "",
        excerpt: "",
        content: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED"
    });

    const dispatch = useDispatch();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        dispatch(showLoader());
        try {
            const response = await axiosInstance.get("/journal");
            if (response.data.success) {
                setBlogs(response.data.data.blogs);
            }
        } catch (error) {
            toast.error("Failed to load journal entries");
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleOpenCreate = () => {
        setModalMode("CREATE");
        setFormData({ title: "", category: "", readTime: "", excerpt: "", content: "", status: "DRAFT" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (blog: BlogPost) => {
        setModalMode("EDIT");
        setSelectedBlog(blog);
        setFormData({
            title: blog.title,
            category: blog.category,
            readTime: blog.readTime,
            excerpt: blog.excerpt,
            content: blog.content,
            status: blog.status
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(showLoader());
        try {
            if (modalMode === "CREATE") {
                const response = await axiosInstance.post("/journal", formData);
                if (response.data.success) {
                    toast.success("Story successfully archived in the Journal");
                    setIsModalOpen(false);
                }
            } else {
                const response = await axiosInstance.patch(`/journal/${selectedBlog?.id}`, formData);
                if (response.data.success) {
                    toast.success("Story successfully updated");
                    setIsModalOpen(false);
                }
            }
            fetchBlogs();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${modalMode.toLowerCase()} story`);
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleToggleStatus = (blog: BlogPost) => {
        setSelectedBlog(blog);
        setIsStatusModalOpen(true);
    };

    const confirmToggleStatus = async () => {
        if (!selectedBlog) return;
        const newStatus = selectedBlog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        dispatch(showLoader());
        try {
            const response = await axiosInstance.patch(`/journal/${selectedBlog.id}`, { status: newStatus });
            if (response.data.success) {
                toast.success(`Story ${newStatus === "PUBLISHED" ? "published" : "moved to drafts"}`);
                setIsStatusModalOpen(false);
                fetchBlogs();
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleDeleteBlog = async () => {
        if (!selectedBlog) return;
        dispatch(showLoader());
        try {
            const response = await axiosInstance.delete(`/journal/${selectedBlog.id}`);
            if (response.data.success) {
                toast.success("Story removed from the Journal");
                setIsDeleteModalOpen(false);
                fetchBlogs();
            }
        } catch (error) {
            toast.error("Failed to delete story");
        } finally {
            dispatch(hideLoader());
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="section-heading text-3xl lowercase italic tracking-tight">The Journal</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Archive of Stories & Craft</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH ARCHIVE..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-secondary/50 border border-border pl-10 pr-4 py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-foreground transition-all w-64"
                        />
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="luxury-button py-2 px-6 flex items-center gap-2 text-[10px]"
                    >
                        <Plus size={14} /> NEW STORY
                    </button>
                    <button
                        onClick={fetchBlogs}
                        className="p-2 border border-border hover:bg-secondary transition-all"
                        title="Refresh Registry"
                    >
                        <RefreshCw size={14} className="text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Blogs Table */}
            <div className="border border-border bg-background overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-secondary/30">
                                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Story Title</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Category</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Read Time</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground">Status</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            <AnimatePresence mode="popLayout">
                                {filteredBlogs.map((blog) => (
                                    <motion.tr
                                        key={blog.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-secondary/10 transition-colors group"
                                    >
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-serif italic text-lg leading-tight group-hover:underline underline-offset-4 decoration-border/50 transition-all">{blog.title}</span>
                                                <span className="text-[9px] uppercase tracking-tighter text-muted-foreground mt-1">/{blog.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] uppercase tracking-widest py-1 px-2 border border-border bg-secondary/20">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock size={12} />
                                                <span className="text-[10px] uppercase tracking-widest">{blog.readTime}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggleStatus(blog)}
                                                className="flex items-center gap-2 group/status"
                                                title={`Click to ${blog.status === "PUBLISHED" ? "Unpublish" : "Publish"}`}
                                            >
                                                {blog.status === "PUBLISHED" ? (
                                                    <div className="flex items-center gap-2 text-emerald-500 group-hover/status:opacity-70 transition-opacity">
                                                        <CheckCircle2 size={12} />
                                                        <span className="text-[10px] uppercase tracking-widest">PUBLISHED</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-amber-500 group-hover/status:opacity-70 transition-opacity">
                                                        <CircleDashed size={12} />
                                                        <span className="text-[10px] uppercase tracking-widest">DRAFT</span>
                                                    </div>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(blog)}
                                                    className="p-2 hover:bg-secondary border border-transparent hover:border-border transition-all"
                                                >
                                                    <Edit size={14} className="text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedBlog(blog);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-2 hover:bg-destructive/5 border border-transparent hover:border-destructive/20 transition-all"
                                                >
                                                    <Trash2 size={14} className="text-destructive/60" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredBlogs.length === 0 && (
                    <div className="py-20 text-center">
                        <FileText className="mx-auto text-muted-foreground/20 mb-4" size={48} strokeWidth={1} />
                        <p className="luxury-text italic text-muted-foreground">No stories found in the current collection.</p>
                    </div>
                )}
            </div>

            {/* Archive Modal (Create/Edit) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-background border border-border shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                                <div>
                                    <h2 className="font-serif italic text-2xl">
                                        {modalMode === "CREATE" ? "Archive New Story" : "Refine Story Archive"}
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                                        {modalMode === "CREATE" ? "Expanding The Journal collection" : "Adjusting the narrative depth"}
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="luxury-label text-[10px] block mb-2">Title of the Story</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-secondary/30 border border-border p-3 text-lg font-serif italic focus:outline-none focus:border-foreground"
                                        placeholder="The Anatomy of..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="luxury-label text-[10px] block mb-2">Category</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-secondary/30 border border-border p-3 text-[10px] uppercase tracking-widest focus:outline-none focus:border-foreground"
                                            placeholder="MATERIALS, CRAFT, HERITAGE..."
                                        />
                                    </div>
                                    <div>
                                        <label className="luxury-label text-[10px] block mb-2">Read Time</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.readTime}
                                            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                            className="w-full bg-secondary/30 border border-border p-3 text-[10px] uppercase tracking-widest focus:outline-none focus:border-foreground"
                                            placeholder="5 MIN READ"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="luxury-label text-[10px] block mb-2">Excerpt (Short Preview)</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full bg-secondary/30 border border-border p-3 text-sm italic focus:outline-none focus:border-foreground resize-none"
                                        placeholder="A brief overview of the narrative..."
                                    />
                                </div>

                                <div>
                                    <label className="luxury-label text-[10px] block mb-2">Main Content</label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-secondary/30 border border-border p-3 text-sm leading-relaxed focus:outline-none focus:border-foreground resize-none"
                                        placeholder="The full narrative depth..."
                                    />
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-t border-border mt-8">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: "DRAFT" })}
                                            className={`w-4 h-4 rounded-full border border-border flex items-center justify-center transition-all ${formData.status === "DRAFT" ? "bg-amber-500 border-amber-500 ring-2 ring-amber-500/20" : ""}`}
                                        />
                                        <span className="text-[10px] uppercase tracking-widest">Draft</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: "PUBLISHED" })}
                                            className={`w-4 h-4 rounded-full border border-border flex items-center justify-center transition-all ${formData.status === "PUBLISHED" ? "bg-emerald-500 border-emerald-500 ring-2 ring-emerald-500/20" : ""}`}
                                        />
                                        <span className="text-[10px] uppercase tracking-widest">Publish</span>
                                    </div>

                                    <div className="flex-1" />

                                    <button
                                        type="submit"
                                        className="luxury-button py-3 px-10 text-[10px]"
                                    >
                                        {modalMode === "CREATE" ? "ARCHIVE STORY" : "SAVE REFINEMENTS"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onConfirm={confirmToggleStatus}
                title={selectedBlog?.status === "PUBLISHED" ? "Unpublish Story?" : "Publish Story?"}
                message={selectedBlog?.status === "PUBLISHED"
                    ? `Are you certain you wish to move "${selectedBlog?.title}" back to drafts? It will no longer be visible to the public.`
                    : `Are you certain you wish to publish "${selectedBlog?.title}"? It will be instantly visible in the public Journal.`}
                buttonText={selectedBlog?.status === "PUBLISHED" ? "Unpublish" : "Publish"}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteBlog}
                title="Deconstruct Story?"
                message={`Are you certain you wish to remove "${selectedBlog?.title}" from the Journal archive? This action is non-reversible.`}
                buttonText="Deconstruct"
            />
        </div>
    );
};

export default BlogManagement;
