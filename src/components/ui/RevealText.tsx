import { motion, type Variants } from "framer-motion";

/**
 * 스크롤로 보일 때마다 단어가 마스크 뒤에서 한 개씩 솟아오르는 세련된 제목 등장.
 * 화면에서 벗어나면 리셋(once:false)되어 다시 올려/내려도 매번 재생.
 */
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const word: Variants = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function RevealText({
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
        <span key={i} className="mr-[0.28em] inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
