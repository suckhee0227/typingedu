import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * 스크롤로 보일 때마다 타자기처럼 한 글자씩 쳐지는 텍스트.
 * 화면에서 벗어나면 리셋되어, 다시 올려/내려도 매번 다시 타이핑됨.
 */
export default function Typewriter({
  text,
  className,
  speed = 38,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed]);

  const done = count >= text.length;

  return (
    <span ref={ref} className={className}>
      {text.slice(0, count)}
      <span className={`ml-0.5 inline-block w-[0.06em] ${done ? "opacity-0" : "animate-pulse"}`}>|</span>
    </span>
  );
}
