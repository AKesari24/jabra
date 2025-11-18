import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="container mx-auto px-4 py-12"
      >
        <motion.div variants={fadeIn} className="max-w-4xl mx-auto">
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent drop-shadow-xl"
          >
            About Jabra
          </motion.h1>

          <motion.div variants={fadeIn} className="space-y-6 text-lg text-muted-foreground backdrop-blur-sm p-6 rounded-xl shadow-2xl bg-white/5">
            <p>
              Welcome to Jabra, your premier destination for high-quality audio equipment and accessories.
              We are dedicated to bringing you the latest and most innovative products in the audio industry.
            </p>

            <p>
              Our mission is to provide exceptional audio solutions that enhance your listening experience,
              whether you're working, gaming, or simply enjoying your favorite music.
            </p>

            <motion.div
              variants={fadeIn}
              className="mt-8"
            >
              <Card className="shadow-xl border border-white/10 bg-gradient-to-br from-background to-background/40 backdrop-blur-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Why Choose Jabra?</h2>
                  <ul className="space-y-3">
                    {[
                      'Premium quality audio products from trusted brands',
                      'Competitive pricing across multiple currencies (INR, USD, EUR)',
                      'Expert customer support and product inquiries',
                      'Wide range of categories from headphones to professional equipment',
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-start"
                      >
                        <span className="text-primary mr-2">✓</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Our Commitment</h2>
              <p>
                At Jabra, we believe that great audio should be accessible to everyone. That's why we offer
                flexible inquiry options and personalized customer service to help you find the perfect products
                for your needs.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-border shadow-lg backdrop-blur-md"
            >
              <h2 className="text-2xl font-bold mb-3 text-foreground">Get in Touch</h2>
              <p>
                Have questions about our products? Want to place a bulk order? Feel free to use our inquiry system
                on any product page, or send us your cart for a comprehensive quote.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}