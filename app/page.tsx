import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import ScrollPath from "@/components/ScrollPath";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Everything below the fold is threaded by the scroll-drawn spine. */}
      <div className="relative">
        <ScrollPath />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </div>
    </>
  );
}
