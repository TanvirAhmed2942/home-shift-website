import React from "react";
import { BookOpen, Calendar, Clock, ArrowRight, User } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
export function Blog() {
  const posts = [
    {
      title: "10 Essential Tips for a Stress-Free Move",
      excerpt:
        "Planning a move? Follow these expert tips to make your relocation smooth and hassle-free.",
      author: "ShiftMyHome Team",
      date: "Dec 10, 2024",
      readTime: "5 min read",
      category: "Moving Tips",
      image:
        "https://images.unsplash.com/photo-1758523671413-cd178a883d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlcyUyMGhvbWV8ZW58MXx8fHwxNzY1ODIwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "How to Pack Fragile Items Like a Pro",
      excerpt:
        "Learn the professional techniques for packing delicate belongings safely and securely.",
      author: "Sarah Johnson",
      date: "Dec 8, 2024",
      readTime: "7 min read",
      category: "Packing Guide",
      image:
        "https://images.unsplash.com/photo-1609188077093-bafe2e2c118d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwdmFufGVufDF8fHx8MTc2NTc2OTg4OHww&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Moving Checklist: Your Complete Guide",
      excerpt:
        "A comprehensive checklist to ensure nothing gets forgotten during your move.",
      author: "Michael Brown",
      date: "Dec 5, 2024",
      readTime: "10 min read",
      category: "Planning",
      image:
        "https://images.unsplash.com/photo-1514739677676-e2c42dc777c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMG1vdmluZ3xlbnwxfHx8fDE3NjU3MjM3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Office Relocation: Best Practices",
      excerpt:
        "Moving your business? Here are the essential steps for a successful office relocation.",
      author: "Emma Wilson",
      date: "Dec 1, 2024",
      readTime: "8 min read",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjU4MTQ4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Sustainable Moving: Eco-Friendly Tips",
      excerpt:
        "Make your move environmentally friendly with these green moving strategies.",
      author: "David Martinez",
      date: "Nov 28, 2024",
      readTime: "6 min read",
      category: "Sustainability",
      image:
        "https://images.unsplash.com/photo-1644079446600-219068676743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzY1ODA1MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Cost-Saving Strategies for Your Move",
      excerpt:
        "Discover practical ways to reduce moving costs without compromising quality.",
      author: "ShiftMyHome Team",
      date: "Nov 25, 2024",
      readTime: "5 min read",
      category: "Budget Tips",
      image:
        "https://images.unsplash.com/photo-1758523671413-cd178a883d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlcyUyMGhvbWV8ZW58MXx8fHwxNzY1ODIwNzk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section
      id="blog"
      className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-3 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 text-sm tracking-wider uppercase">
              Our Blog
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Moving Insights &{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Expert Advice
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Stay informed with tips, guides, and industry insights from our
            moving experts
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-block bg-gradient-to-r ${post.gradient} text-white text-xs px-3 py-1.5 rounded-full shadow-lg`}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <button className="group/btn flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-300">
                    <span className="text-sm font-semibold">
                      Continue Reading
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-16 text-center">
          <Button
            variant="default"
            className="inline-flex h-14 text-xl w-full items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer"
          >
            <span className="font-semibold">View All Articles</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}

export default Blog;
