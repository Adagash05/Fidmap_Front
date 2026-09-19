import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo, { SITE_URL } from "../../components/Seo";
import { getPostBySlug, POSTS } from "../../content/posts";
import { APP_URL } from "../../constants/pricing";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const renderBlock = (block, i) => {
  if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
  if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
  if (block.type === "ul")
    return (
      <ul key={i}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  return <p key={i}>{block.text}</p>;
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = POSTS.filter((p) => post.relatedSlugs?.includes(p.slug));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "FIDMAP" },
    publisher: { "@type": "Organization", name: "FIDMAP" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <MarketingLayout>
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogType="article"
        jsonLd={articleJsonLd}
      />

      <article className="fm-legal" style={{ maxWidth: 720, paddingTop: 40 }}>
        <p className="fm-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
          {formatDate(post.date)} · FIDMAP team
        </p>
        <h1 className="fm-legal-title">{post.title}</h1>

        {post.body.map(renderBlock)}

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <a href={`${APP_URL}/register`} className="fm-btn-primary">
            Start free trial <ArrowRight size={14} />
          </a>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2>Related articles</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </MarketingLayout>
  );
};

export default BlogPost;
