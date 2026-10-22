
import { profile } from "@/data/profile"
import { ProfileContactLink } from "@/components/profile-contact-link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-surface-subtle">
      <main className="pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero Section */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-border shadow-lg">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    width={144}
                    height={144}
                    loading="lazy"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <span className="w-1 h-8 bg-primary rounded-full" />
                  关于我
                </h1>
                <p className="text-xl text-muted-foreground mb-4">{profile.bio}</p>


                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {profile.links.map((link) => {
                    return (
                      <ProfileContactLink
                        key={link.name}
                        link={link}
                        className="p-2.5 rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        iconClassName="w-5 h-5"
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Bio Section */}
          <section className="mb-16">
            <div className="prose prose-neutral dark:prose-invert max-w-none
              prose-p:text-base prose-p:leading-8 prose-p:my-5 prose-p:text-foreground/90 dark:prose-p:text-foreground
              prose-a:text-primary prose-a:no-underline prose-a:hover:underline
              prose-blockquote:border-l-primary prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-content-secondary prose-blockquote:font-normal prose-blockquote:bg-surface-subtle prose-blockquote:py-2 prose-blockquote:rounded-r-lg
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:text-foreground/90 dark:prose-ul:text-foreground prose-ul:my-5
              prose-li:marker:text-primary prose-li:my-1.5"
            >
              <blockquote>
                记录、思考与折腾。
              </blockquote>
              <p>
                你好，我是 Zak。这里记录技术、阅读和生活里的一些想法。
              </p>
              <p>
                这个博客基于 Astro 构建，主题来自 VermilionVoid。
              </p>
              <p>
                📮 <a href="mailto:email@zxu.cc">email@zxu.cc</a>
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
