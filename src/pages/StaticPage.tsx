import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

interface Highlight {
  title: string;
  description: string;
}

export interface StaticPageProps {
  title: string;
  description: string;
  eyebrow?: string;
  highlights?: Highlight[];
  primaryCta?: {
    label: string;
    to: string;
  };
  secondaryCta?: {
    label: string;
    to: string;
  };
}

const defaultHighlights: Highlight[] = [
  {
    title: 'Clear next steps',
    description: 'Actionable guidance that connects product features to outcomes.',
  },
  {
    title: 'Developer friendly',
    description: 'Built for fast iteration with reliable upload and processing flows.',
  },
  {
    title: 'Ready to scale',
    description: 'Designed to grow with your document volume and embedding needs.',
  },
];

const StaticPage: React.FC<StaticPageProps> = ({
  title,
  description,
  eyebrow = 'DevVault',
  highlights = defaultHighlights,
  primaryCta = { label: 'Get Started', to: '/upload' },
  secondaryCta = { label: 'View Documents', to: '/documents' },
}) => {
  return (
    <Layout className="px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            {eyebrow}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <Button asChild size="lg" className="px-8">
            <Link to={primaryCta.to}>{primaryCta.label}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="border rounded-xl p-6 bg-white dark:bg-gray-900 hover-lift"
            >
              <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default StaticPage;
