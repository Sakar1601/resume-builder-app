"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Zap, Download, Sparkles, Eye, Target, ArrowRight, Check, Edit3, FileCheck } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { AppScreenshotHero } from "@/components/landing/app-screenshot-hero"
import { AppScreenshotEditor } from "@/components/landing/app-screenshot-editor"
import { AppScreenshotAI } from "@/components/landing/app-screenshot-ai"
import { AppScreenshotTailor } from "@/components/landing/app-screenshot-tailor"

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
}

const heroButton = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 150,
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 120,
    },
  },
}

const parallaxItem = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 80,
      duration: 0.8,
    },
  },
}

const parallaxItemReverse = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 80,
      duration: 0.8,
    },
  },
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 80,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

function FeatureSection({
  children,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode
  reverse?: boolean
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? { opacity: 1 } : reverse ? parallaxItemReverse.hidden : parallaxItem.hidden}
      animate={
        isInView
          ? reverse
            ? parallaxItemReverse.visible
            : parallaxItem.visible
          : reverse
            ? parallaxItemReverse.hidden
            : parallaxItem.hidden
      }
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">ResumeBuilder</span>
            </motion.div>
            <motion.nav
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Link href="/auth/login">
                <Button variant="ghost" className="font-medium transition-all hover:scale-105">
                  Login
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                  Get Started
                </Button>
              </Link>
            </motion.nav>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-secondary/30 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-28">
            {/* Left side - Content */}
            <motion.div className="space-y-8" variants={heroStagger} initial="hidden" animate="visible">
              <div className="space-y-6">
                <motion.div
                  variants={heroItem}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  <Sparkles className="h-4 w-4" />
                  AI-Powered Resume Builder
                </motion.div>
                <motion.h1
                  variants={heroItem}
                  className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-[1.1]"
                >
                  Land your dream job faster
                </motion.h1>
                <motion.p
                  variants={heroItem}
                  className="text-xl lg:text-2xl text-muted-foreground text-pretty max-w-xl"
                >
                  Build ATS-friendly resumes with AI assistance. No signup required to start.
                </motion.p>
              </div>

              <motion.div variants={heroItem} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  >
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-base px-8 py-6 font-semibold shadow-lg hover:shadow-2xl hover:shadow-primary/40 transition-shadow"
                    >
                      Build Resume
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto text-base px-8 py-6 font-semibold border-2 bg-transparent"
                    >
                      Try as Guest
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div variants={heroItem} className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">ATS-Friendly</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">No signup required</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Export as PDF</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative order-1 lg:order-2"
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.4 },
                x: { type: "spring", damping: 20, stiffness: 100, delay: 0.4 },
                scale: { type: "spring", damping: 15, stiffness: 100, delay: 0.4 },
                y: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1.2,
                },
              }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.03,
                      rotateY: 5,
                      rotateX: -2,
                      transition: { type: "spring", damping: 20 },
                    }
              }
            >
              <AppScreenshotHero />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">How it works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From blank page to perfect resume in four simple steps
              </p>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto relative"
            variants={shouldReduceMotion ? {} : staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                step: "01",
                icon: Edit3,
                title: "Fill details",
                description: "Enter your information with our intuitive form",
              },
              {
                step: "02",
                icon: Eye,
                title: "Live preview",
                description: "See your resume update in real-time",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Improve with AI",
                description: "Enhance bullets and tailor to jobs",
              },
              {
                step: "04",
                icon: FileCheck,
                title: "Export & apply",
                description: "Download as ATS-friendly PDF",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative">
                <motion.div
                  className="flex flex-col items-center text-center space-y-4"
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -10,
                          transition: { type: "spring", damping: 15, stiffness: 200 },
                        }
                  }
                >
                  <div className="relative">
                    <motion.div
                      className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30"
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: 1.1,
                              boxShadow: "0 20px 40px rgba(var(--primary-rgb), 0.4)",
                            }
                      }
                    >
                      <motion.div
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : {
                                rotate: 360,
                                scale: 1.2,
                              }
                        }
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon className="h-10 w-10 text-primary-foreground" />
                      </motion.div>
                    </motion.div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary text-xs font-bold text-primary">
                      {item.step}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-y bg-secondary/30 py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 space-y-32">
          {/* Feature 1 - Editor */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FeatureSection className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  Real-time editing
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold tracking-tight">Live editor with instant preview</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  See your changes instantly as you type. Our split-view editor shows exactly how your resume will look
                  to recruiters, with automatic formatting and ATS-friendly structure.
                </p>
                <ul className="space-y-3">
                  {["Auto-save as you type", "Clean, professional templates", "Mobile-friendly editing"].map(
                    (item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-base">{item}</span>
                      </motion.li>
                    ),
                  )}
                </ul>
              </div>
            </FeatureSection>
            <FeatureSection className="order-1 lg:order-2">
              <motion.div
                className="relative"
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.05,
                        y: -10,
                        rotateY: -5,
                      }
                }
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <AppScreenshotEditor />
              </motion.div>
            </FeatureSection>
          </div>

          {/* Feature 2 - AI bullets (swapped sides) */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FeatureSection>
              <motion.div
                className="relative order-2 lg:order-1"
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.05,
                        y: -10,
                        rotateY: 5,
                      }
                }
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <AppScreenshotAI />
              </motion.div>
            </FeatureSection>
            <FeatureSection className="order-1 lg:order-2">
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Enhancement
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold tracking-tight">AI-powered bullet improvement</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Transform weak bullets into powerful achievements. Our AI suggests impactful rewrites that highlight
                  your accomplishments and use industry-standard action verbs.
                </p>
                <ul className="space-y-3">
                  {["3 suggestions per bullet", "Choose your tone", "Preserve your meaning"].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-base">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FeatureSection>
          </div>

          {/* Feature 3 - Job tailoring */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FeatureSection className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Target className="h-3.5 w-3.5" />
                  Smart Matching
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold tracking-tight">Tailor to any job description</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Paste a job description and get AI-powered suggestions to optimize your resume. Find missing keywords,
                  improve alignment, and increase your chances of getting past ATS systems.
                </p>
                <ul className="space-y-3">
                  {["Identify missing keywords", "Targeted suggestions", "One-click apply changes"].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-base">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FeatureSection>
            <FeatureSection className="order-1 lg:order-2">
              <motion.div
                className="relative"
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.05,
                        y: -10,
                        rotateY: -5,
                      }
                }
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <AppScreenshotTailor />
              </motion.div>
            </FeatureSection>
          </div>

          {/* Feature 4 - PDF export (swapped sides) */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FeatureSection className="order-2 lg:order-1">
              <motion.div
                className="relative order-2 lg:order-1"
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.05,
                        y: -10,
                        rotateY: 5,
                      }
                }
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
              >
                <div className="relative">
                  <div className="h-48 w-36 rounded-lg border-2 bg-white dark:bg-card shadow-2xl p-3 space-y-2">
                    <div className="h-2 w-20 bg-foreground/30 rounded-full" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-foreground/10 rounded-full" />
                      <div className="h-1 w-4/5 bg-foreground/10 rounded-full" />
                      <div className="h-1 w-3/5 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="h-1 w-full bg-foreground/10 rounded-full" />
                      <div className="h-1 w-full bg-foreground/10 rounded-full" />
                    </div>
                  </div>
                  <motion.div
                    className="absolute -bottom-3 -right-3 h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: 1.2,
                            rotate: 360,
                          }
                    }
                    transition={{ type: "spring", damping: 15, stiffness: 150 }}
                  >
                    <Download className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                </div>
              </motion.div>
            </FeatureSection>
            <FeatureSection className="order-1 lg:order-2">
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Download className="h-3.5 w-3.5" />
                  Export Ready
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold tracking-tight">Export perfect PDFs instantly</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Download your resume as a professionally formatted, ATS-optimized PDF. What you see in the preview is
                  exactly what you'll get in the export.
                </p>
                <ul className="space-y-3">
                  {["ATS-optimized formatting", "Consistent rendering", "One-click download"].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-base">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </FeatureSection>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/95 to-primary text-primary-foreground py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 80,
            }}
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Try everything. No signup.</h2>
              <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
                Start building your resume immediately as a guest. Full access to all features with no commitment.
              </p>
            </div>

            <motion.div
              className="grid sm:grid-cols-3 gap-6 pt-8"
              variants={shouldReduceMotion ? {} : staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: Edit3, text: "Full editor access" },
                { icon: Sparkles, text: "AI-powered features" },
                { icon: Download, text: "PDF export" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: 1.05,
                          y: -5,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                        }
                  }
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <p className="font-medium">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", damping: 20 }}
            >
              <Link href="/auth/sign-up">
                <motion.div
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                >
                  <Button size="lg" variant="secondary" className="text-base px-8 py-6 font-semibold shadow-2xl">
                    Start Building Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <p className="text-sm text-primary-foreground/70 mt-4">
                Want to save your work? Create a free account anytime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-t bg-gradient-to-b from-background to-secondary/50 py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 80,
            }}
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance">
                Ready to stand out?
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands building their careers with ResumeBuilder
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/sign-up" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base px-8 py-6 font-semibold shadow-lg hover:shadow-2xl hover:shadow-primary/40 transition-shadow"
                  >
                    Build My Resume
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/auth/sign-up" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base px-8 py-6 font-semibold border-2 bg-transparent"
                  >
                    Continue as Guest
                  </Button>
                </motion.div>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground pt-2">
              Free to start. No credit card required. Export anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">ResumeBuilder</span>
            </div>
            <p className="text-sm text-muted-foreground">&copy; 2025 ResumeBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
