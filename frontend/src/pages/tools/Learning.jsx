// src/pages/tools/Learning.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PlayCircle,
  Calendar,
  Search,
  AlertCircle,
  ExternalLink,
  FileText,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

/* ============================
   DATA LOADER
============================ */
const useEducationContent = () => {
  const [data, setData] = useState({ articles: [], videos: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/education/index.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load education index");
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

/* ============================
   PAGE
============================ */
export default function Learning() {
  const { data, loading, error } = useEducationContent();
  const [searchText, setSearchText] = useState("");

  const filteredArticles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return data.articles || [];

    return (data.articles || []).filter((a) => {
      const title = (a?.title || "").toLowerCase();
      const category = (a?.category || "").toLowerCase();
      const summary = (a?.summary || "").toLowerCase();
      return title.includes(q) || category.includes(q) || summary.includes(q);
    });
  }, [data.articles, searchText]);

  if (error) {
    return (
      <DashboardLayout title="Learning Center">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-14 w-14 text-red-500 mb-4" />
          <p className="text-gray-600">Unable to load learning resources.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Learning Center"
      subtitle="Original financial intelligence created by Oli-Branch teams"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6 space-y-6"
      >
        {/* ================= VIDEO SECTION ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-6 w-6 text-[#1B4332]" />
              Educational Videos
            </CardTitle>
            <CardDescription>
              Watch agent-curated financial education on our official channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="btn-primary gap-2">
              <a
                href="https://www.youtube.com/@AdminContact-xd1xk"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit YouTube Channel
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* ================= SEARCH ================= */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B4332]/30"
          />
        </div>

        {/* ================= ARTICLES ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[#1B4332]" />
              Intelligence Briefs
            </CardTitle>
            <CardDescription>
              Original articles written by Oli-Branch research teams
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading && <p className="text-gray-500">Loading content…</p>}

            {!loading && filteredArticles.length === 0 && (
              <p className="text-gray-500">No articles found.</p>
            )}

            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ scale: 1.01 }}
                className="border rounded-xl p-5 flex justify-between items-start gap-4"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-[#1B4332]">
                    {article.title}
                  </h3>
                  <p className="text-gray-600">{article.summary}</p>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {article.publishedAt}
                    <Badge className="category-badge">{article.category}</Badge>
                    <span>{article.readingTime}</span>
                  </div>
                </div>

                <Button
                  className="btn-secondary gap-2"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <FileText className="h-4 w-4" />
                  Read
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
