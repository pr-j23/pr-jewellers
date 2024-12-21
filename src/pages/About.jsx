import React from "react";
import { Award, Shield, Heart, Sparkles } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Expert Craftsmanship",
    description:
      "Each piece is meticulously crafted by our master jewelers with decades of experience.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description:
      "All our jewelry pieces undergo rigorous quality checks and come with certification.",
  },
  {
    icon: Heart,
    title: "Customer Satisfaction",
    description:
      "We pride ourselves on providing exceptional service and building lasting relationships.",
  },
  {
    icon: Sparkles,
    title: "Innovative Design",
    description:
      "As a first-generation jeweler, we bring fresh, creative approaches to every piece, ensuring unique designs that reflect your style.",
  },
  // {
  //   icon: Users,
  //   title: 'Family Legacy',
  //   description:
  //     'Three generations of jewelry expertise, serving our community since 1970.',
  // },
];

export default function About() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif mb-4">About Pavan Jewellers</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          For more than a decade, we have been creating exquisite silver jewelry
          that honors life’s most cherished moments. Our dedication to quality
          and meticulous attention to detail have established us as a trusted
          name in both wholesale and retail fine jewelry.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="relative h-[400px] lg:col-span-1">
          <img
            src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=800"
            alt="Jewelry Workshop"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col lg:col-span-2">
          <h2 className="text-3xl font-serif mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2014, Pavan Jewellers began as a small family workshop
            driven by a passion for creating beautiful, handcrafted jewelry.
            Today, we continue this tradition of excellence by combining
            time-honored techniques with modern innovation. We specialize in
            custom designs, taking orders and crafting unique pieces tailored to
            our customers’ individual requirements.
          </p>
          <p className="text-gray-600">
            Our skilled artisans and certified gemologists collaborate to craft
            pieces that are not only visually stunning but also rich in meaning.
            Each creation reflects our unwavering commitment to quality and our
            deep appreciation for the art of jewelry making.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-lg"
            >
              <IconComponent className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-serif mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
