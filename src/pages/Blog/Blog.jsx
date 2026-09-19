import { Link } from "react-router-dom";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo from "../../components/Seo";
import { POSTS } from "../../content/posts";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const Blog = () => (
  <MarketingLayout>
    <Seo
      title="Blog"
      description="Guides on customer feedback management, feature request prioritization, and building a customer-driven product roadmap."
      path="/blog"
    />

    <section className="fm-mkt-hero" style={{ paddingBottom: 32 }}>
      <div className="fm-mkt-eyebrow fm-mono">Blog</div>
      <h1 className="fm-display fm-mkt-h1">Feedback &amp; roadmap guides</h1>
    </section>

    <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 64px" }}>
      {POSTS.map((post) => (
        <article key={post.slug} style={{ marginBottom: 28 }}>
          <div className="fm-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            {formatDate(post.date)}
          </div>
          <h2 style={{ margin: "6px 0 6px" }}>
            <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              {post.title}
            </Link>
          </h2>
          <p style={{ color: "var(--ink-soft)", margin: 0 }}>{post.description}</p>
        </article>
      ))}
    </section>
  </MarketingLayout>
);

export default Blog;
