import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader = () => {
    const { isLoading } = useSelector((state: RootState) => state.loader);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-16 h-16">
                            {/* Inner Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-foreground rounded-full"
                            />
                            {/* Outer Pulse */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 border border-foreground/30 rounded-full"
                            />
                        </div>
                        <motion.span
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="luxury-label italic lower-case tracking-[0.3em]"
                        >
                            Refining...
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoader;
