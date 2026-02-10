import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message?: string;
    buttonText: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    buttonText,
    onConfirm,
    onClose
}: ConfirmationModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md bg-background border border-border p-10 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                            <AlertCircle size={120} />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={24} />
                            </div>

                            <span className="luxury-label block mb-2 lowercase italic">Confirmation Required</span>
                            <h2 className="section-heading italic text-2xl mb-4">{title}</h2>

                            {message && (
                                <p className="luxury-text text-sm text-foreground/60 mb-8 lowercase">
                                    {message}
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 text-[10px] uppercase tracking-[0.2em] border border-border hover:bg-secondary transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 px-6 py-3 text-[10px] uppercase tracking-[0.2em] bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-300"
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
