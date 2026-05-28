import { motion, type Variants } from "framer-motion";

/**
 * 2단계 시퀀스: 단어 마스크 솟음 → 전체 우→중앙 슬라이드.
 * 트리거는 부모의 variants 상태(hidden/visible)를 그대로 따라감.
 * 부모에서 motion.div + initial/whileInView를 걸어주면 자식들이 함께 발사됨.
 * delay로 같은 트리거 안에서 살짝 늦은 시작이 가능.
 */
export default function ScrollSlideIn({
  text,
  className,
  distance = 80,
  delay = 0,
}: {
  text: string;
  className?: string;
  distance?: number;
  delay?: number;
}) {
  const container: Variants = {
    hidden: { x: distance },
    visible: {
      x: 0,
      transition: {
        x: { duration: 0.4, delay: 0.4 + delay, ease: [0.22, 1, 0.36, 1] },
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };
  const word: Variants = {
    hidden: { y: "110%" },
    visible: { y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.span
      variants={container}
      style={{ display: "inline-block", willChange: "transform" }}
      className={className}
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
