"use client";

import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiShadcnui, SiGo } from "react-icons/si";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-8 md:px-20 py-16">
      <h1 className="text-5xl font-bold text-green-600 mb-6">About Thoth HR</h1>
      <p className="text-lg text-gray-700 max-w-3xl mb-12">
        Thoth HR is a modern payroll and HR system designed for SMEs, built to streamline 
        employee management, automate payroll, and offer advanced savings and loan features. 
        We combine cutting-edge technology with a user-friendly interface to give 
        businesses an all-in-one HR solution.
      </p>

      {/* Technologies Used */}
      <h2 className="text-3xl font-semibold mb-4">Technologies We Use</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
        <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition">
          <SiNextdotjs size={40} className="text-gray-900" />
          <span className="mt-2 font-medium">Next.js</span>
        </div>
        <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition">
          <SiTailwindcss size={40} className="text-sky-500" />
          <span className="mt-2 font-medium">Tailwind CSS</span>
        </div>
        <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition">
          <SiShadcnui size={40} className="text-gray-800" />
          <span className="mt-2 font-medium">ShadCN UI</span>
        </div>
      
        <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition">
          <FaReact size={40} className="text-sky-500" />
          <span className="mt-2 font-medium">React</span>
        </div>
        <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition">
          <FaNodeJs size={40} className="text-green-600" />
          <span className="mt-2 font-medium">Node.js</span>
        </div>
        <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition">
          <FaDatabase size={40} className="text-yellow-600" />
          <span className="mt-2 font-medium">Zustland</span>
        </div>
      </div>

      {/* Mission Statement */}
      <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
      <p className="text-lg text-gray-700 max-w-3xl mb-12">
        We aim to empower businesses with simple yet powerful payroll and HR tools, 
        helping them save time, reduce errors, and focus on growth. Thoth HR is committed 
        to delivering innovation, reliability, and scalability.
      </p>

      {/* Call to Action */}
      <div className="mt-10">
        <a
          href="/register"
          className="px-6 py-3 bg-green-600 text-white rounded-full text-lg font-medium hover:bg-green-700 transition"
        >
          Get Started with Thoth HR
        </a>
      </div>
    </div>
  );
}

