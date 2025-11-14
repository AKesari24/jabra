import { Header } from '@/components/Header';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in gradient-text">
            About Jabra
          </h1>
          
          <div className="space-y-6 text-lg text-muted-foreground animate-slide-up">
            <p>
              Welcome to Jabra, your premier destination for high-quality audio equipment and accessories. 
              We are dedicated to bringing you the latest and most innovative products in the audio industry.
            </p>
            
            <p>
              Our mission is to provide exceptional audio solutions that enhance your listening experience, 
              whether you're working, gaming, or simply enjoying your favorite music. We carefully curate 
              our product selection to ensure that every item meets our high standards of quality and performance.
            </p>
            
            <div className="bg-card p-8 rounded-lg shadow-soft mt-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Why Choose Jabra?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Premium quality audio products from trusted brands</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Competitive pricing across multiple currencies (INR, USD, EUR)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Expert customer support and product inquiries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Wide range of categories from headphones to professional equipment</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Our Commitment</h2>
              <p>
                At Jabra, we believe that great audio should be accessible to everyone. That's why we offer 
                flexible inquiry options and personalized customer service to help you find the perfect 
                products for your needs. Our team is always ready to assist you with product recommendations, 
                specifications, and any questions you may have.
              </p>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-card rounded-lg border border-border">
              <h2 className="text-2xl font-bold mb-3 text-foreground">Get in Touch</h2>
              <p>
                Have questions about our products? Want to place a bulk order? Feel free to use our 
                product inquiry system on any product page, or send us your cart for a comprehensive quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
