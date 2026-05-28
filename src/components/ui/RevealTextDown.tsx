import { motion, type Variants } from "framer-motion";

/**
 * RevealText의 거울 버전 — 단어가 마스크 위에서 아래로 내려와 자리잡음.
 * 헤드라인(아래→위)과 짝을 이루는 서브텍스트용.
 */
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const word: Variants = {
  hidden: { y: "-110%" },
  visible: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function RevealTextDown({
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
        <span key={i} className="mr-[0.28em] inline-block overflow-hidden pt-[0.14em] align-top">
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
