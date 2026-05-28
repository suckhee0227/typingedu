import { motion, type Variants } from "framer-motion";

/**
 * 단어별 블러-인 페이드. 초점이 서서히 맞춰지듯 차분하게 등장.
 * 헤드라인이 드라마틱하게 솟을 때 서브텍스트는 조용히 또렷해지는 대비용.
 */
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const word: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 6 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function BlurFadeIn({
  text,
  className,
  justify = "center",
}: {
  text: string;
  className?: string;
  justify?: "center" | "start";
}) {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-60px" }}
      variants={container}
      className={`flex w-full flex-wrap ${justify === "center" ? "justify-center" : "justify-start"} ${className ?? ""}`}
    >
      {text.split(" ").map((w, i) => (
        <motion.span key={i} variants={word} className="mr-[0.28em] inline-block">
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}
