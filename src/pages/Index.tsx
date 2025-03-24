
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Database, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Modern Document Processing Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl animate-slide-down">
              Transform Your <span className="text-primary">Documents</span> into Powerful Vector Embeddings
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 animate-slide-down" style={{ animationDelay: '100ms' }}>
              Upload, process, and analyze JSON, PDF, and TXT files with our cutting-edge platform for developers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button asChild size="lg" className="px-8">
                <Link to="/upload">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/documents">View Documents</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Developers</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform offers everything you need to transform your documents into actionable data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Upload className="w-6 h-6 text-primary" />}
              title="Multiple File Types"
              description="Support for JSON, PDF, and TXT files with intelligent processing for each type."
              delay={0}
            />
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-primary" />}
              title="Text Processing"
              description="Advanced text extraction and processing capabilities for all your documents."
              delay={100}
            />
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-primary" />}
              title="Vector Embeddings"
              description="Transform your documents into embeddings for semantic search and AI applications."
              delay={200}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A simple three-step process to transform your documents into embeddings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Upload Your Files"
              description="Upload your JSON, PDF, or TXT files through our simple interface."
              delay={0}
            />
            <StepCard 
              number="02"
              title="Automatic Processing"
              description="Our system automatically processes and extracts content from your files."
              delay={100}
            />
            <StepCard 
              number="03"
              title="Embeddings Generation"
              description="Vector embeddings are generated and stored for use in your applications."
              delay={200}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Join thousands of developers who are already using our platform to enhance their applications.
          </p>
          <Button asChild size="lg" variant="secondary" className="px-8">
            <Link to="/upload" className="flex items-center">
              Upload Your First Document <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <div 
    className="border rounded-xl p-6 bg-white dark:bg-gray-800 hover-lift animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description, delay }) => (
  <div 
    className="relative overflow-hidden border rounded-xl p-6 bg-white dark:bg-gray-800 hover-lift animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <span className="absolute -top-4 -left-4 text-8xl font-bold text-gray-100 dark:text-gray-700 select-none">
      {number}
    </span>
    <div className="relative z-10">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

export default Index;
